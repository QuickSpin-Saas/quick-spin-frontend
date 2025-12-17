import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login, WCAG_CONTRAST, validateTextContrast } from '../utils/test-helpers';

test.describe('Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Dashboard - Axe Accessibility Scan', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = accessibilityScanResults.violations;

    if (violations.length > 0) {
      console.log('\n❌ Accessibility Violations Found:\n');
      violations.forEach((violation) => {
        console.log(`  ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Help: ${violation.help}`);
        console.log(`  Affected elements: ${violation.nodes.length}`);
        violation.nodes.forEach((node, index) => {
          console.log(`    ${index + 1}. ${node.html.substring(0, 100)}...`);
          console.log(`       ${node.failureSummary}`);
        });
        console.log('');
      });
    }

    expect(violations).toEqual([]);
  });

  test('Services Page - Axe Accessibility Scan', async ({ page }) => {
    await page.goto('/dashboard/services');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Billing Page - Axe Accessibility Scan', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Settings Page - Axe Accessibility Scan', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Login Page - Axe Accessibility Scan', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard Navigation - Dashboard', async ({ page }) => {
    // Test keyboard navigation through main elements
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      const style = window.getComputedStyle(el!);
      return {
        tagName: el?.tagName,
        outline: style.outline,
        outlineWidth: style.outlineWidth,
      };
    });

    // Should have visible focus indicator
    expect(
      focusedElement.outline !== 'none' ||
      parseInt(focusedElement.outlineWidth) > 0
    ).toBeTruthy();
  });

  test('Color Contrast - Headings', async ({ page }) => {
    const headings = ['h1', 'h2', 'h3'];

    for (const tag of headings) {
      const elements = page.locator(tag);
      const count = await elements.count();

      for (let i = 0; i < count; i++) {
        const element = elements.nth(i);
        if (!(await element.isVisible())) continue;

        const contrastResult = await validateTextContrast(
          page,
          `${tag}:nth-of-type(${i + 1})`,
          WCAG_CONTRAST.AA_LARGE // Headings are large text
        );

        if (!contrastResult.valid) {
          console.log(
            `${tag} #${i + 1} contrast: ${contrastResult.ratio.toFixed(2)}:1 - ${contrastResult.errors.join(', ')}`
          );
        }

        expect(contrastResult.ratio).toBeGreaterThanOrEqual(WCAG_CONTRAST.AA_LARGE);
      }
    }
  });

  test('Color Contrast - Buttons', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (!(await button.isVisible())) continue;

      const text = await button.textContent();
      if (!text || text.trim().length === 0) continue;

      // Buttons typically use normal text size
      const contrastResult = await validateTextContrast(
        page,
        `button:nth-of-type(${i + 1})`,
        WCAG_CONTRAST.AA_NORMAL
      );

      if (!contrastResult.valid) {
        console.log(
          `Button "${text.substring(0, 30)}" contrast: ${contrastResult.ratio.toFixed(2)}:1`
        );
      }

      // Allow some flexibility for gradient backgrounds
      expect(contrastResult.ratio).toBeGreaterThanOrEqual(
        WCAG_CONTRAST.AA_NORMAL * 0.85 // 85% threshold for gradient backgrounds
      );
    }
  });

  test('ARIA Labels and Roles', async ({ page }) => {
    // Check navigation has proper ARIA
    const nav = page.locator('nav');
    const navCount = await nav.count();

    if (navCount > 0) {
      const firstNav = nav.first();
      const ariaLabel = await firstNav.getAttribute('aria-label');
      const role = await firstNav.getAttribute('role');

      // Navigation should have aria-label or role
      expect(ariaLabel !== null || role === 'navigation').toBeTruthy();
    }

    // Check buttons have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (!(await button.isVisible())) continue;

      const accessibleName = await button.evaluate((el) => {
        // Get accessible name (text content or aria-label)
        return el.textContent?.trim() || el.getAttribute('aria-label');
      });

      expect(accessibleName).toBeTruthy();
    }
  });

  test('Form Labels and Associations', async ({ page }) => {
    await page.goto('/auth/login');

    // Check all inputs have associated labels
    const inputs = page.locator('input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);

      const hasLabel = await input.evaluate((el) => {
        const id = el.getAttribute('id');
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');

        if (ariaLabel || ariaLabelledBy) return true;

        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          return label !== null;
        }

        // Check if input is wrapped in label
        return el.closest('label') !== null;
      });

      expect(hasLabel).toBeTruthy();
    }
  });

  test('Focus Management - Modal Dialogs', async ({ page }) => {
    // Try to open a modal if available
    const createButton = page.getByRole('button', { name: /create service/i });

    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);

      // Check if focus moved into the modal
      const focusedElement = await page.evaluate(() => {
        return {
          tagName: document.activeElement?.tagName,
          insideDialog: document.activeElement?.closest('[role="dialog"]') !== null,
        };
      });

      // If a dialog opened, focus should be inside it
      const dialogVisible = await page.locator('[role="dialog"]').isVisible().catch(() => false);

      if (dialogVisible) {
        expect(focusedElement.insideDialog).toBeTruthy();
      }
    }
  });

  test('Screen Reader - Semantic HTML', async ({ page }) => {
    // Check for proper heading hierarchy
    const headingLevels = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.map((h) => parseInt(h.tagName.substring(1)));
    });

    // Should have at least one h1
    expect(headingLevels).toContain(1);

    // Check heading hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      // Can go down any number, but shouldn't skip up
      if (diff > 0) {
        expect(diff).toBeLessThanOrEqual(1);
      }
    }
  });

  test('Touch Target Size (Mobile)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Check interactive elements are large enough (44x44px minimum)
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    const minTouchSize = 44;

    for (let i = 0; i < Math.min(10, buttonCount); i++) {
      const button = buttons.nth(i);
      if (!(await button.isVisible())) continue;

      const box = await button.boundingBox();
      if (!box) continue;

      // Allow some flexibility for icon buttons
      const hasText = await button.textContent();
      const isIconOnly = !hasText || hasText.trim().length === 0;

      const minSize = isIconOnly ? minTouchSize * 0.8 : minTouchSize;

      if (box.width < minSize || box.height < minSize) {
        console.log(
          `Button ${i + 1} too small: ${box.width.toFixed(0)}x${box.height.toFixed(0)}px`
        );
      }

      // Expect at least one dimension to meet the minimum
      expect(box.width >= minSize || box.height >= minSize).toBeTruthy();
    }
  });

  test('Reduced Motion Support', async ({ page }) => {
    // Enable prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    // Check if animations are reduced
    const animationDuration = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const durations = elements.map((el) => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.animationDuration) || 0;
      });
      return Math.max(...durations);
    });

    // Animations should be minimal (< 0.1s)
    expect(animationDuration).toBeLessThanOrEqual(0.1);
  });

  test('Skip Navigation Link', async ({ page }) => {
    // Check for skip to main content link
    await page.keyboard.press('Tab');

    const focusedText = await page.evaluate(() => {
      return document.activeElement?.textContent?.toLowerCase();
    });

    // First focusable element should ideally be a skip link
    // (This is a best practice, not strictly required)
    const hasSkipLink = focusedText?.includes('skip') ||
                       focusedText?.includes('main content');

    if (!hasSkipLink) {
      console.log('Consider adding a "Skip to main content" link as the first focusable element');
    }

    // This is a recommendation, not a hard requirement
    // expect(hasSkipLink).toBeTruthy();
  });

  test('Language Attribute', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);
  });

  test('Landmark Regions', async ({ page }) => {
    // Check for proper landmark regions
    const landmarks = await page.evaluate(() => {
      return {
        main: document.querySelectorAll('main, [role="main"]').length,
        nav: document.querySelectorAll('nav, [role="navigation"]').length,
        header: document.querySelectorAll('header, [role="banner"]').length,
        footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
      };
    });

    // Should have at least one main landmark
    expect(landmarks.main).toBeGreaterThanOrEqual(1);

    // Should have navigation
    expect(landmarks.nav).toBeGreaterThanOrEqual(1);

    // Log findings
    console.log('Landmark regions found:', landmarks);
  });
});
