# QuickSpin Frontend Testing Guide

## Overview

This guide provides comprehensive documentation for the automated testing suite implemented for the QuickSpin frontend application. The testing framework uses Playwright with additional tools for accessibility, visual regression, and performance testing.

## Table of Contents

1. [Testing Architecture](#testing-architecture)
2. [Test Categories](#test-categories)
3. [Running Tests](#running-tests)
4. [Test Utilities](#test-utilities)
5. [Visual Regression Testing](#visual-regression-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Performance Testing](#performance-testing)
8. [CI/CD Integration](#cicd-integration)
9. [Writing New Tests](#writing-new-tests)
10. [Troubleshooting](#troubleshooting)

---

## Testing Architecture

### Framework Stack

- **Playwright**: E2E testing framework
- **@axe-core/playwright**: Accessibility testing (WCAG 2.1 AA compliance)
- **pixelmatch**: Visual regression and screenshot comparison
- **pngjs**: PNG image processing for visual diffs

### Test Structure

```
quick-spin-frontend/
├── tests/
│   ├── e2e/
│   │   ├── dashboard-comprehensive.spec.ts  # Dashboard tests
│   │   ├── accessibility.spec.ts            # Accessibility tests
│   │   ├── auth.spec.ts                     # Authentication tests
│   │   ├── billing.spec.ts                  # Billing tests
│   │   └── services.spec.ts                 # Services tests
│   └── utils/
│       └── test-helpers.ts                  # Shared utilities
├── playwright.config.ts                     # Playwright configuration
└── test-results/                           # Generated test artifacts
    ├── screenshots/                        # Full page screenshots
    │   └── widgets/                        # Widget-specific screenshots
    ├── html-report/                        # HTML test reports
    ├── artifacts/                          # Videos, traces
    └── *.md                                # Generated test reports
```

---

## Test Categories

### 1. Visual Regression Tests

**Purpose**: Ensure UI consistency across different viewports and themes.

**Coverage**:
- Full page screenshots at multiple breakpoints
- Widget-level screenshot validation
- Dark mode vs. Light mode comparisons
- Cross-browser visual consistency

**Breakpoints Tested**:
- Mobile: 375x667px
- Mobile Landscape: 667x375px
- Tablet: 768x1024px
- Tablet Landscape: 1024x768px
- Desktop: 1280x800px
- Desktop Large: 1920x1080px

### 2. Accessibility Tests (WCAG 2.1 AA)

**Purpose**: Ensure the application is accessible to all users, including those with disabilities.

**Coverage**:
- ✅ Color contrast validation (AA and AAA standards)
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ ARIA labels and roles
- ✅ Form label associations
- ✅ Focus management
- ✅ Touch target sizes (mobile)
- ✅ Reduced motion support
- ✅ Semantic HTML structure
- ✅ Landmark regions

### 3. Component Styling Tests

**Purpose**: Validate the two-color widget scheme (purple glassy + white) and consistent styling.

**Coverage**:
- Glassmorphism effect validation
- Color scheme adherence
- Shadow and border styling
- Typography consistency
- Responsive layout behavior

### 4. Performance Tests

**Purpose**: Ensure fast page load times and optimal user experience.

**Metrics Measured**:
- **FCP (First Contentful Paint)**: Target < 1800ms
- **LCP (Largest Contentful Paint)**: Target < 2500ms
- **TTFB (Time to First Byte)**: Target < 600ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **FID (First Input Delay)**: Target < 100ms

### 5. Functional Tests

**Purpose**: Verify core functionality works as expected.

**Coverage**:
- User authentication flows
- Service creation and management
- Billing operations
- Settings management
- Navigation and routing

---

## Running Tests

### Prerequisites

```bash
cd quick-spin-frontend
npm install
```

### Run All Tests

```bash
# Run all tests
npx playwright test

# Run tests with UI
npx playwright test --ui

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/e2e/dashboard-comprehensive.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium-desktop
```

### Run Specific Test Categories

```bash
# Run only accessibility tests
npx playwright test tests/e2e/accessibility.spec.ts

# Run only dashboard tests
npx playwright test tests/e2e/dashboard-comprehensive.spec.ts

# Run tests matching a pattern
npx playwright test --grep "Widget Styling"
```

### View Test Reports

```bash
# View HTML report
npx playwright show-report

# View specific test report
open test-results/dashboard-test-report.md
```

### Debug Tests

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/e2e/dashboard-comprehensive.spec.ts --debug

# Generate trace for debugging
npx playwright test --trace on
npx playwright show-trace trace.zip
```

---

## Test Utilities

### Shared Test Helpers

Located in `tests/utils/test-helpers.ts`, these utilities provide reusable functions for common testing tasks.

#### Breakpoints

```typescript
import { BREAKPOINTS } from '../utils/test-helpers';

// Use predefined breakpoints
await page.setViewportSize({
  width: BREAKPOINTS.mobile.width,
  height: BREAKPOINTS.mobile.height,
});
```

#### Screenshot Utilities

```typescript
import { takeFullPageScreenshot, takeElementScreenshot } from '../utils/test-helpers';

// Full page screenshot
await takeFullPageScreenshot(page, 'dashboard', BREAKPOINTS.desktop);

// Element screenshot
await takeElementScreenshot(page, '.stats-card', 'stats-card-1');
```

#### Color Scheme Validation

```typescript
import { validateWidgetColorScheme } from '../utils/test-helpers';

const result = await validateWidgetColorScheme(page, '.card');
expect(result.valid).toBeTruthy();
```

#### Contrast Validation

```typescript
import { validateTextContrast, WCAG_CONTRAST } from '../utils/test-helpers';

const result = await validateTextContrast(
  page,
  'h1',
  WCAG_CONTRAST.AA_LARGE
);
expect(result.ratio).toBeGreaterThanOrEqual(WCAG_CONTRAST.AA_LARGE);
```

#### Performance Measurement

```typescript
import { measurePagePerformance } from '../utils/test-helpers';

const metrics = await measurePagePerformance(page);
console.log(`FCP: ${metrics.fcp}ms`);
console.log(`LCP: ${metrics.lcp}ms`);
```

#### Responsive Testing

```typescript
import { testResponsiveLayout } from '../utils/test-helpers';

await testResponsiveLayout(page, async (viewport) => {
  // Test logic for each viewport
  await expect(page.locator('nav')).toBeVisible();
});
```

---

## Visual Regression Testing

### How It Works

1. **Baseline Generation**: First run captures screenshots as baselines
2. **Comparison**: Subsequent runs compare against baselines
3. **Diff Generation**: Differences are highlighted in diff images
4. **Threshold**: Configurable pixel difference threshold (default: 0.2%)

### Configuration

In `playwright.config.ts`:

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,    // Maximum pixel difference allowed
    threshold: 0.2,        // Percentage threshold (0.2 = 0.2%)
  },
}
```

### Usage Example

```typescript
test('Visual regression test', async ({ page }) => {
  await page.goto('/dashboard');

  // Compare against baseline
  await expect(page).toHaveScreenshot('dashboard.png');

  // Compare specific element
  await expect(page.locator('.stats-card')).toHaveScreenshot('stats-card.png');
});
```

### Updating Baselines

```bash
# Update all screenshots
npx playwright test --update-snapshots

# Update specific test
npx playwright test dashboard-comprehensive.spec.ts --update-snapshots
```

---

## Accessibility Testing

### WCAG 2.1 Levels

- **Level A**: Basic accessibility features (minimum)
- **Level AA**: Deals with common barriers (target standard)
- **Level AAA**: Highest level of accessibility (aspirational)

QuickSpin targets **WCAG 2.1 Level AA** compliance.

### Contrast Requirements

| Text Size | Level AA | Level AAA |
|-----------|----------|-----------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18pt+) | 3:1 | 4.5:1 |

### Running Accessibility Tests

```bash
# Run all accessibility tests
npx playwright test tests/e2e/accessibility.spec.ts

# Run specific accessibility test
npx playwright test --grep "Axe Accessibility Scan"
```

### Interpreting Results

Accessibility violations are categorized by impact:

- **Critical**: Must fix immediately
- **Serious**: Important to fix
- **Moderate**: Should fix when possible
- **Minor**: Nice to have

### Common Issues and Fixes

#### Low Color Contrast

**Issue**: Text doesn't have sufficient contrast with background

**Fix**:
```css
/* Ensure minimum 4.5:1 contrast ratio */
.text {
  color: #000000; /* Dark text */
  background-color: #FFFFFF; /* Light background */
}
```

#### Missing Alt Text

**Issue**: Images missing alternative text

**Fix**:
```tsx
<img src="/logo.png" alt="QuickSpin Logo" />
```

#### Missing Form Labels

**Issue**: Form inputs not associated with labels

**Fix**:
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

---

## Performance Testing

### Core Web Vitals

QuickSpin tracks Google's Core Web Vitals:

1. **LCP (Largest Contentful Paint)**
   - Measures loading performance
   - Target: < 2.5s (good), < 4s (needs improvement)

2. **FID (First Input Delay)**
   - Measures interactivity
   - Target: < 100ms (good), < 300ms (needs improvement)

3. **CLS (Cumulative Layout Shift)**
   - Measures visual stability
   - Target: < 0.1 (good), < 0.25 (needs improvement)

### Running Performance Tests

```bash
npx playwright test --grep "Performance Benchmarks"
```

### Performance Budget

Current thresholds:

```typescript
const thresholds = {
  fcp: 1800,   // First Contentful Paint
  lcp: 2500,   // Largest Contentful Paint
  ttfb: 600,   // Time to First Byte
};
```

### Optimization Tips

1. **Optimize Images**: Use Next.js Image component
2. **Code Splitting**: Lazy load components
3. **Minimize JavaScript**: Remove unused dependencies
4. **Enable Caching**: Configure proper cache headers
5. **Use CDN**: Serve static assets from CDN

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: |
          cd quick-spin-frontend
          npm ci

      - name: Install Playwright Browsers
        run: |
          cd quick-spin-frontend
          npx playwright install --with-deps

      - name: Run Playwright tests
        run: |
          cd quick-spin-frontend
          npx playwright test

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: quick-spin-frontend/test-results/
          retention-days: 30
```

### Test Reports in CI

- HTML reports are generated in `test-results/html-report/`
- Screenshots saved in `test-results/screenshots/`
- Test artifacts uploaded as GitHub Actions artifacts

---

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../utils/test-helpers';

test.describe('My Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/my-feature');
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('My Feature');
  });

  test('should handle user interaction', async ({ page }) => {
    await page.click('button');
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Semantic Selectors**: Prefer `getByRole`, `getByText` over CSS selectors
2. **Wait for Elements**: Use `waitForSelector` or `expect().toBeVisible()`
3. **Clean Up**: Use `beforeEach` and `afterEach` for setup/teardown
4. **Descriptive Names**: Use clear, descriptive test names
5. **One Assertion Per Test**: Keep tests focused
6. **Avoid Hard-Coded Waits**: Use `waitForLoadState` instead of `waitForTimeout`

### Testing Patterns

#### Testing Forms

```typescript
test('should submit form', async ({ page }) => {
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

#### Testing Modals

```typescript
test('should open and close modal', async ({ page }) => {
  await page.click('button:has-text("Open Modal")');
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  await page.click('[aria-label="Close"]');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

#### Testing API Calls

```typescript
test('should load data from API', async ({ page }) => {
  await page.route('**/api/services', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ services: [] }),
    });
  });

  await page.goto('/dashboard/services');
  await expect(page.locator('.service-list')).toBeVisible();
});
```

---

## Troubleshooting

### Common Issues

#### Tests Failing Locally But Pass in CI

**Cause**: Different screen resolutions or browser versions

**Solution**:
```bash
# Ensure browsers are up to date
npx playwright install --with-deps

# Run tests with same configuration as CI
npx playwright test --project=chromium-desktop
```

#### Screenshot Differences

**Cause**: Font rendering, antialiasing differences

**Solution**:
```typescript
// Increase threshold tolerance
await expect(page).toHaveScreenshot('page.png', {
  threshold: 0.3, // Allow 0.3% difference
});
```

#### Flaky Tests

**Cause**: Race conditions, network delays

**Solution**:
```typescript
// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for specific element
await page.waitForSelector('.element', { state: 'visible' });

// Use auto-waiting
await expect(page.locator('.element')).toBeVisible();
```

#### Timeout Errors

**Cause**: Slow page load, slow network

**Solution**:
```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes

  await page.goto('/dashboard');
});

// Or in playwright.config.ts
timeout: 60000, // 1 minute global timeout
```

### Debug Commands

```bash
# Run with debug output
DEBUG=pw:api npx playwright test

# Run in headed mode with slow motion
npx playwright test --headed --slow-mo=1000

# Generate detailed trace
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Getting Help

- **Playwright Docs**: https://playwright.dev
- **Axe-core Docs**: https://www.deque.com/axe/
- **Project Issues**: https://github.com/quickspin/frontend/issues

---

## Test Maintenance

### Regular Tasks

1. **Update Baselines**: When UI intentionally changes
2. **Review Flaky Tests**: Identify and fix unstable tests
3. **Update Dependencies**: Keep testing tools up to date
4. **Monitor Performance**: Track performance trends over time
5. **Accessibility Audits**: Regular accessibility reviews

### Monthly Checklist

- [ ] Run full test suite across all browsers
- [ ] Review and update visual regression baselines
- [ ] Check accessibility compliance
- [ ] Analyze performance trends
- [ ] Update test documentation
- [ ] Review and fix flaky tests
- [ ] Update browser versions

---

## Conclusion

This testing suite provides comprehensive coverage of the QuickSpin frontend application, ensuring:

✅ **Visual Consistency**: Screenshots across all breakpoints and themes
✅ **Accessibility**: WCAG 2.1 AA compliance
✅ **Performance**: Fast page loads and optimal UX
✅ **Functionality**: Core features work as expected
✅ **Quality**: Automated testing prevents regressions

For questions or issues, please refer to the troubleshooting section or contact the development team.
