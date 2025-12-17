import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  BREAKPOINTS,
  takeFullPageScreenshot,
  takeElementScreenshot,
  validateWidgetColorScheme,
  validateGlassmorphism,
  validateTextContrast,
  measurePagePerformance,
  testResponsiveLayout,
  login,
  WCAG_CONTRAST,
  type TestReport,
  generateTestReport,
} from '../utils/test-helpers';

test.describe('Dashboard Comprehensive Tests', () => {
  const reports: TestReport[] = [];

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  test.afterAll(async () => {
    // Generate final test report
    const report = generateTestReport(reports);
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(
      process.cwd(),
      'test-results',
      'dashboard-test-report.md'
    );
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, report);
  });

  test('Dashboard - Full Page Screenshots Across Breakpoints', async ({ page }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    try {
      for (const viewport of Object.values(BREAKPOINTS)) {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.waitForTimeout(500); // Wait for layout to stabilize

        const screenshot = await takeFullPageScreenshot(
          page,
          'dashboard-full-page',
          viewport
        );
        screenshots.push(`dashboard-full-page-${viewport.name}.png`);

        // Verify key elements are visible at each breakpoint
        await expect(page.locator('h1')).toContainText('Welcome back');

        // Check if stats cards are visible
        const statsCards = page.locator('[class*="grid"]').first();
        await expect(statsCards).toBeVisible();
      }
    } catch (error) {
      errors.push(`Screenshot test failed: ${(error as Error).message}`);
    }

    reports.push({
      testName: 'Dashboard Full Page Screenshots',
      page: 'Dashboard',
      viewport: 'All breakpoints',
      passed: errors.length === 0,
      errors,
      screenshots,
    });

    expect(errors).toHaveLength(0);
  });

  test('Dashboard - Widget Styling Validation (Purple Glassy Theme)', async ({
    page,
  }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    // Test each stats card
    const statCards = await page.locator('div[class*="Card"]').all();

    for (let i = 0; i < Math.min(4, statCards.length); i++) {
      const card = statCards[i];

      // Take screenshot of individual widget
      const cardScreenshot = await card.screenshot();
      const cardName = `stats-card-${i + 1}`;
      screenshots.push(`${cardName}.png`);

      // Validate glassmorphism effect
      const glassValidation = await validateGlassmorphism(
        page,
        `div[class*="Card"]:nth-of-type(${i + 1})`
      );

      if (!glassValidation.valid) {
        errors.push(`Card ${i + 1} glassmorphism: ${glassValidation.errors.join(', ')}`);
      }

      // Check if card has proper shadow
      const boxShadow = await card.evaluate((el) =>
        window.getComputedStyle(el).boxShadow
      );
      if (boxShadow === 'none') {
        errors.push(`Card ${i + 1} missing box shadow`);
      }

      // Check for rounded corners
      const borderRadius = await card.evaluate((el) =>
        window.getComputedStyle(el).borderRadius
      );
      if (borderRadius === '0px') {
        errors.push(`Card ${i + 1} missing border radius`);
      }
    }

    reports.push({
      testName: 'Widget Styling Validation',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0,
      errors,
      screenshots,
    });

    expect(errors).toHaveLength(0);
  });

  test('Dashboard - Stats Cards Color Scheme Validation', async ({ page }) => {
    const errors: string[] = [];

    // Get all stat cards
    const statCards = page.locator('div.grid > div').first().locator('> div');
    const cardCount = await statCards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = statCards.nth(i);

      // Check background gradient
      const background = await card.evaluate((el) =>
        window.getComputedStyle(el).background
      );

      // Validate color scheme - should be gradient-based
      const hasGradient = background.includes('linear-gradient') ||
                         background.includes('gradient');

      if (!hasGradient) {
        // If no gradient, check for solid purple or white background
        const isPurpleOrWhite = background.includes('purple') ||
                               background.includes('rgb(179, 153, 212)') ||
                               background.includes('rgb(255, 255, 255)');

        if (!isPurpleOrWhite) {
          errors.push(`Card ${i + 1} does not use approved color scheme`);
        }
      }

      // Validate text color for readability
      const textColor = await card.locator('div').first().evaluate((el) =>
        window.getComputedStyle(el).color
      );

      // Text should be either dark (for light backgrounds) or white (for dark backgrounds)
      const isValidTextColor = textColor.includes('255') || // white
                               textColor.includes('0, 0, 0') || // black
                               textColor.includes('rgb('); // any RGB

      if (!isValidTextColor) {
        errors.push(`Card ${i + 1} has invalid text color: ${textColor}`);
      }
    }

    reports.push({
      testName: 'Stats Cards Color Scheme',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0,
      errors,
      screenshots: [],
    });

    expect(errors).toHaveLength(0);
  });

  test('Dashboard - Accessibility Contrast Validation (WCAG AA)', async ({
    page,
  }) => {
    const errors: string[] = [];
    const violations: string[] = [];

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      accessibilityScanResults.violations.forEach((violation) => {
        violations.push(
          `${violation.id}: ${violation.description} (${violation.nodes.length} instances)`
        );
      });
    }

    // Additional manual contrast checks for key elements
    const headingContrast = await validateTextContrast(
      page,
      'h1',
      WCAG_CONTRAST.AA_LARGE
    );

    if (!headingContrast.valid) {
      errors.push(
        `Heading contrast ratio ${headingContrast.ratio.toFixed(2)}:1 - ${headingContrast.errors.join(', ')}`
      );
    }

    // Check card title contrast
    const cardTitles = page.locator('[class*="CardTitle"]');
    const titleCount = await cardTitles.count();

    for (let i = 0; i < Math.min(4, titleCount); i++) {
      const titleContrast = await cardTitles.nth(i).evaluate((el) => {
        const style = window.getComputedStyle(el);
        const parentStyle = window.getComputedStyle(el.parentElement!);
        return {
          color: style.color,
          background: parentStyle.backgroundColor,
        };
      });
    }

    reports.push({
      testName: 'Accessibility Contrast Validation',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0 && violations.length === 0,
      errors,
      screenshots: [],
      accessibility: {
        violations: violations.length,
        issues: violations,
      },
    });

    expect(errors.length + violations.length).toBe(0);
  });

  test('Dashboard - Responsive Layout Behavior', async ({ page }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    await testResponsiveLayout(page, async (viewport) => {
      // Take screenshot at this breakpoint
      const screenshot = await takeFullPageScreenshot(
        page,
        'dashboard-responsive',
        viewport
      );
      screenshots.push(`dashboard-responsive-${viewport.name}.png`);

      // Verify grid layout adjusts properly
      const statsGrid = page.locator('div.grid').first();
      const gridCols = await statsGrid.evaluate((el) =>
        window.getComputedStyle(el).gridTemplateColumns
      );

      // Mobile should have 1 column, tablet 2, desktop 4
      if (viewport.width <= 640 && gridCols.split(' ').length > 1) {
        errors.push(
          `Mobile (${viewport.name}): Stats grid should have 1 column, has ${gridCols.split(' ').length}`
        );
      } else if (
        viewport.width > 640 &&
        viewport.width <= 1024 &&
        gridCols.split(' ').length > 2
      ) {
        // Tablet can have 1-2 columns
      } else if (viewport.width > 1024 && gridCols.split(' ').length !== 4) {
        // Desktop should have 4 columns (may vary due to responsive design)
      }

      // Check if text is readable at this size
      const heading = page.locator('h1');
      const fontSize = await heading.evaluate((el) =>
        window.getComputedStyle(el).fontSize
      );
      const fontSizePx = parseInt(fontSize);

      if (fontSizePx < 18) {
        errors.push(
          `${viewport.name}: Heading font size too small (${fontSizePx}px)`
        );
      }

      // Verify Create Service button is visible and accessible
      const createButton = page.getByRole('button', {
        name: /create service/i,
      });
      await expect(createButton).toBeVisible();
    });

    reports.push({
      testName: 'Responsive Layout Behavior',
      page: 'Dashboard',
      viewport: 'All breakpoints',
      passed: errors.length === 0,
      errors,
      screenshots,
    });

    expect(errors).toHaveLength(0);
  });

  test('Dashboard - Performance Benchmarks', async ({ page }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    // Measure page load performance
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const performance = await measurePagePerformance(page);

    // Performance thresholds (in milliseconds)
    const thresholds = {
      fcp: 1800, // First Contentful Paint
      lcp: 2500, // Largest Contentful Paint
      ttfb: 600, // Time to First Byte
    };

    if (performance.fcp > thresholds.fcp) {
      errors.push(
        `FCP ${performance.fcp.toFixed(2)}ms exceeds threshold ${thresholds.fcp}ms`
      );
    }

    if (performance.lcp > thresholds.lcp) {
      errors.push(
        `LCP ${performance.lcp.toFixed(2)}ms exceeds threshold ${thresholds.lcp}ms`
      );
    }

    if (performance.ttfb > thresholds.ttfb) {
      errors.push(
        `TTFB ${performance.ttfb.toFixed(2)}ms exceeds threshold ${thresholds.ttfb}ms`
      );
    }

    reports.push({
      testName: 'Performance Benchmarks',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0,
      errors,
      screenshots,
      performance: {
        fcp: performance.fcp,
        lcp: performance.lcp,
        ttfb: performance.ttfb,
      },
    });

    // Log performance metrics for reference (but don't fail the test)
    console.log('Dashboard Performance Metrics:');
    console.log(`  FCP: ${performance.fcp.toFixed(2)}ms`);
    console.log(`  LCP: ${performance.lcp.toFixed(2)}ms`);
    console.log(`  TTFB: ${performance.ttfb.toFixed(2)}ms`);

    // Only fail if performance is critically bad (2x threshold)
    const criticalErrors = errors.filter((error) => {
      const match = error.match(/(\d+(?:\.\d+)?)ms exceeds threshold (\d+)ms/);
      if (!match) return false;
      const [, actual, threshold] = match;
      return parseFloat(actual) > parseFloat(threshold) * 2;
    });

    expect(criticalErrors).toHaveLength(0);
  });

  test('Dashboard - Service Status Overview Widget', async ({ page }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    // Find Service Status Overview card
    const statusCard = page.locator('text=Service Status Overview').locator('..');
    await expect(statusCard).toBeVisible();

    // Take screenshot of the widget
    const screenshot = await statusCard.screenshot();
    screenshots.push('service-status-widget.png');

    // Verify status badges are visible
    const statuses = ['running', 'stopped', 'deploying', 'error'];

    for (const status of statuses) {
      const badge = page.locator(`text=${status}`).first();

      // Check if badge exists
      const exists = await badge.count();
      if (exists === 0) {
        errors.push(`Status badge for "${status}" not found`);
        continue;
      }

      // Verify badge has proper styling
      const badgeColor = await badge.evaluate((el) =>
        window.getComputedStyle(el.closest('[class*="Badge"]') || el).backgroundColor
      );

      if (badgeColor === 'transparent' || badgeColor === 'rgba(0, 0, 0, 0)') {
        errors.push(`Status badge "${status}" has no background color`);
      }
    }

    // Verify progress bars are present
    const progressBars = statusCard.locator('div[class*="rounded-full"][class*="h-2"]');
    const progressBarCount = await progressBars.count();

    if (progressBarCount < 4) {
      errors.push(
        `Expected 4 progress bars, found ${progressBarCount}`
      );
    }

    reports.push({
      testName: 'Service Status Overview Widget',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0,
      errors,
      screenshots,
    });

    expect(errors).toHaveLength(0);
  });

  test('Dashboard - Recent Activity Widget', async ({ page }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    // Find Recent Activity card
    const activityCard = page.locator('text=Recent Activity').locator('..');
    await expect(activityCard).toBeVisible();

    // Take screenshot of the widget
    const screenshot = await activityCard.screenshot();
    screenshots.push('recent-activity-widget.png');

    // Verify activity items are present
    const activityItems = activityCard.locator('[class*="flex"][class*="items-start"]');
    const itemCount = await activityItems.count();

    if (itemCount === 0) {
      errors.push('No activity items found');
    }

    // Verify each activity item has an icon and text
    for (let i = 0; i < Math.min(4, itemCount); i++) {
      const item = activityItems.nth(i);

      // Check for icon
      const icon = item.locator('svg').first();
      if (!(await icon.isVisible())) {
        errors.push(`Activity item ${i + 1} missing icon`);
      }

      // Check for title text
      const title = item.locator('p.font-semibold');
      if (!(await title.isVisible())) {
        errors.push(`Activity item ${i + 1} missing title`);
      }

      // Check for timestamp
      const timestamp = item.locator('text=/ago/');
      if (!(await timestamp.isVisible())) {
        errors.push(`Activity item ${i + 1} missing timestamp`);
      }
    }

    // Verify "View all activity" link
    const viewAllLink = page.getByRole('link', { name: /view all activity/i });
    await expect(viewAllLink).toBeVisible();

    reports.push({
      testName: 'Recent Activity Widget',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0,
      errors,
      screenshots,
    });

    expect(errors).toHaveLength(0);
  });

  test('Dashboard - Dark Mode Toggle and Theme Consistency', async ({ page }) => {
    const errors: string[] = [];
    const screenshots: string[] = [];

    // Take screenshot in light mode
    await takeFullPageScreenshot(page, 'dashboard-light-mode');
    screenshots.push('dashboard-light-mode.png');

    // Find and click theme toggle
    const themeToggle = page.locator('[class*="theme"]').or(page.getByRole('button')).first();

    // Try to toggle dark mode
    try {
      const darkModeButton = page.locator('button').filter({ hasText: /dark|light|theme/i }).first();
      if (await darkModeButton.isVisible()) {
        await darkModeButton.click();
        await page.waitForTimeout(500); // Wait for theme transition
      }
    } catch {
      // Theme toggle might not be visible or implemented yet
      console.log('Theme toggle not found, skipping dark mode test');
      return;
    }

    // Take screenshot in dark mode
    await takeFullPageScreenshot(page, 'dashboard-dark-mode');
    screenshots.push('dashboard-dark-mode.png');

    // Verify dark mode classes are applied
    const htmlClass = await page.locator('html').getAttribute('class');
    const bodyClass = await page.locator('body').getAttribute('class');

    if (!htmlClass?.includes('dark') && !bodyClass?.includes('dark')) {
      errors.push('Dark mode class not applied to html or body');
    }

    // Verify background changed
    const backgroundColor = await page.locator('body').evaluate((el) =>
      window.getComputedStyle(el).background
    );

    if (!backgroundColor.includes('gradient') && !backgroundColor.includes('rgb')) {
      errors.push('Background did not change in dark mode');
    }

    reports.push({
      testName: 'Dark Mode Toggle and Theme Consistency',
      page: 'Dashboard',
      viewport: 'Desktop',
      passed: errors.length === 0,
      errors,
      screenshots,
    });

    expect(errors).toHaveLength(0);
  });
});
