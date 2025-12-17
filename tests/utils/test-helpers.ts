import { Page, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';

/**
 * Responsive breakpoints for testing
 */
export const BREAKPOINTS = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  mobileLandscape: { width: 667, height: 375, name: 'mobile-landscape' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  tabletLandscape: { width: 1024, height: 768, name: 'tablet-landscape' },
  desktop: { width: 1280, height: 800, name: 'desktop' },
  desktopLarge: { width: 1920, height: 1080, name: 'desktop-large' },
} as const;

/**
 * WCAG 2.1 Contrast ratio constants
 */
export const WCAG_CONTRAST = {
  AA_NORMAL: 4.5, // Normal text AA
  AA_LARGE: 3, // Large text AA (18pt+)
  AAA_NORMAL: 7, // Normal text AAA
  AAA_LARGE: 4.5, // Large text AAA
} as const;

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Parse RGB color from string
 */
export function parseRGB(colorString: string): { r: number; g: number; b: number } | null {
  const rgb = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgb) return null;
  return {
    r: parseInt(rgb[1]),
    g: parseInt(rgb[2]),
    b: parseInt(rgb[3]),
  };
}

/**
 * Take a full page screenshot and save it
 */
export async function takeFullPageScreenshot(
  page: Page,
  name: string,
  viewport?: { width: number; height: number; name: string }
): Promise<Buffer> {
  const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const filename = viewport
    ? `${name}-${viewport.name}.png`
    : `${name}.png`;
  const filepath = path.join(screenshotDir, filename);

  const screenshot = await page.screenshot({
    path: filepath,
    fullPage: true,
  });

  return screenshot;
}

/**
 * Take a screenshot of a specific element
 */
export async function takeElementScreenshot(
  page: Page,
  selector: string,
  name: string
): Promise<Buffer | null> {
  const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots', 'widgets');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const element = page.locator(selector);
  if (!(await element.isVisible())) {
    console.warn(`Element ${selector} not visible for screenshot`);
    return null;
  }

  const filepath = path.join(screenshotDir, `${name}.png`);
  const screenshot = await element.screenshot({ path: filepath });

  return screenshot;
}

/**
 * Compare two screenshots and return difference percentage
 */
export function compareScreenshots(
  img1Path: string,
  img2Path: string,
  diffPath: string
): number {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return (numDiffPixels / (width * height)) * 100;
}

/**
 * Test if an element has proper styling
 */
export async function validateElementStyling(
  page: Page,
  selector: string,
  expectedStyles: Record<string, string>
): Promise<{ valid: boolean; errors: string[] }> {
  const element = page.locator(selector);
  const errors: string[] = [];

  for (const [property, expectedValue] of Object.entries(expectedStyles)) {
    const actualValue = await element.evaluate(
      (el, prop) => window.getComputedStyle(el).getPropertyValue(prop),
      property
    );

    if (actualValue !== expectedValue) {
      errors.push(
        `${property}: expected "${expectedValue}", got "${actualValue}"`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Test if widget follows the two-color scheme (purple glassy + white)
 */
export async function validateWidgetColorScheme(
  page: Page,
  selector: string
): Promise<{ valid: boolean; errors: string[] }> {
  const element = page.locator(selector);
  const errors: string[] = [];

  // Check background
  const backgroundColor = await element.evaluate((el) =>
    window.getComputedStyle(el).backgroundColor
  );

  // Check if background is purple gradient, white, or transparent
  const isPurpleGradient =
    backgroundColor.includes('linear-gradient') ||
    backgroundColor.includes('purple') ||
    backgroundColor.includes('rgb(179, 153, 212)'); // #B399D4

  const isWhite =
    backgroundColor.includes('rgb(255, 255, 255)') ||
    backgroundColor.includes('rgba(255, 255, 255');

  const isTransparent =
    backgroundColor.includes('rgba(0, 0, 0, 0)') ||
    backgroundColor === 'transparent';

  if (!isPurpleGradient && !isWhite && !isTransparent) {
    errors.push(
      `Background color should be purple gradient, white, or transparent. Got: ${backgroundColor}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate contrast ratio for text elements
 */
export async function validateTextContrast(
  page: Page,
  selector: string,
  minRatio: number = WCAG_CONTRAST.AA_NORMAL
): Promise<{ valid: boolean; ratio: number; errors: string[] }> {
  const element = page.locator(selector);
  const errors: string[] = [];

  const [textColor, backgroundColor] = await element.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return [style.color, style.backgroundColor];
  });

  const textRGB = parseRGB(textColor);
  const bgRGB = parseRGB(backgroundColor);

  if (!textRGB || !bgRGB) {
    errors.push('Could not parse colors');
    return { valid: false, ratio: 0, errors };
  }

  const ratio = getContrastRatio(textRGB, bgRGB);

  if (ratio < minRatio) {
    errors.push(
      `Contrast ratio ${ratio.toFixed(2)}:1 is below minimum ${minRatio}:1`
    );
  }

  return {
    valid: errors.length === 0,
    ratio,
    errors,
  };
}

/**
 * Wait for all images to load on the page
 */
export async function waitForImagesToLoad(page: Page): Promise<void> {
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    );
  });
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Measure page load performance
 */
export async function measurePagePerformance(page: Page): Promise<{
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}> {
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Wait for page to be fully loaded
      if (document.readyState === 'complete') {
        resolve(getMetrics());
      } else {
        window.addEventListener('load', () => resolve(getMetrics()));
      }

      function getMetrics() {
        const perfData = performance.getEntriesByType('navigation')[0] as any;
        let fcp = 0;
        let lcp = 0;
        let cls = 0;

        // Get FCP
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          fcp = fcpEntry.startTime;
        }

        // Get LCP (simplified - actual implementation would use PerformanceObserver)
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          lcp = lcpEntries[lcpEntries.length - 1].startTime;
        }

        return {
          fcp,
          lcp,
          cls, // Would need PerformanceObserver for accurate CLS
          fid: 0, // Would need PerformanceObserver for FID
          ttfb: perfData?.responseStart || 0,
        };
      }
    });
  });

  return metrics as any;
}

/**
 * Test responsive behavior across all breakpoints
 */
export async function testResponsiveLayout(
  page: Page,
  testFn: (viewport: typeof BREAKPOINTS[keyof typeof BREAKPOINTS]) => Promise<void>
): Promise<void> {
  for (const viewport of Object.values(BREAKPOINTS)) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500); // Wait for layout to stabilize
    await testFn(viewport);
  }
}

/**
 * Check if glassmorphism effect is properly applied
 */
export async function validateGlassmorphism(
  page: Page,
  selector: string
): Promise<{ valid: boolean; errors: string[] }> {
  const element = page.locator(selector);
  const errors: string[] = [];

  const styles = await element.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return {
      backdropFilter: style.backdropFilter,
      background: style.background,
      border: style.border,
      boxShadow: style.boxShadow,
    };
  });

  // Check for backdrop blur
  if (!styles.backdropFilter.includes('blur')) {
    errors.push('Missing backdrop-filter blur for glassmorphism');
  }

  // Check for semi-transparent background
  if (!styles.background.includes('rgba') && !styles.background.includes('hsla')) {
    errors.push('Background should be semi-transparent for glassmorphism');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Login helper for authenticated tests
 */
export async function login(
  page: Page,
  email: string = 'demo@quickspin.dev',
  password: string = 'Demo@123'
): Promise<void> {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

/**
 * Generate a test report
 */
export interface TestReport {
  testName: string;
  page: string;
  viewport: string;
  passed: boolean;
  errors: string[];
  screenshots: string[];
  performance?: {
    fcp: number;
    lcp: number;
    ttfb: number;
  };
  accessibility?: {
    violations: number;
    issues: string[];
  };
}

export function generateTestReport(reports: TestReport[]): string {
  const timestamp = new Date().toISOString();
  const totalTests = reports.length;
  const passedTests = reports.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;

  let report = `# UI Test Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total Tests:** ${totalTests}\n`;
  report += `- **Passed:** ${passedTests}\n`;
  report += `- **Failed:** ${failedTests}\n`;
  report += `- **Success Rate:** ${((passedTests / totalTests) * 100).toFixed(2)}%\n\n`;

  report += `## Test Details\n\n`;

  for (const testReport of reports) {
    const status = testReport.passed ? '✅ PASS' : '❌ FAIL';
    report += `### ${status} - ${testReport.testName}\n\n`;
    report += `- **Page:** ${testReport.page}\n`;
    report += `- **Viewport:** ${testReport.viewport}\n`;

    if (testReport.errors.length > 0) {
      report += `- **Errors:**\n`;
      testReport.errors.forEach((error) => {
        report += `  - ${error}\n`;
      });
    }

    if (testReport.performance) {
      report += `- **Performance:**\n`;
      report += `  - FCP: ${testReport.performance.fcp.toFixed(2)}ms\n`;
      report += `  - LCP: ${testReport.performance.lcp.toFixed(2)}ms\n`;
      report += `  - TTFB: ${testReport.performance.ttfb.toFixed(2)}ms\n`;
    }

    if (testReport.accessibility) {
      report += `- **Accessibility:**\n`;
      report += `  - Violations: ${testReport.accessibility.violations}\n`;
      if (testReport.accessibility.issues.length > 0) {
        report += `  - Issues:\n`;
        testReport.accessibility.issues.forEach((issue) => {
          report += `    - ${issue}\n`;
        });
      }
    }

    if (testReport.screenshots.length > 0) {
      report += `- **Screenshots:** ${testReport.screenshots.length} captured\n`;
    }

    report += `\n`;
  }

  return report;
}
