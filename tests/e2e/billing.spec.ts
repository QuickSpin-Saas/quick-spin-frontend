import { test, expect } from '@playwright/test';

test.describe('Billing & Settings', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/billing/summary', async route => {
      await route.fulfill({
        json: {
          plan: 'Pro',
          amount: 29.99,
          currency: 'USD',
          status: 'active',
          nextBillingDate: new Date(Date.now() + 86400000 * 15).toISOString(),
          usage: {
            bandwidth: { used: 150, limit: 1000, unit: 'GB' },
            services: { used: 5, limit: 20 }
          }
        }
      });
    });

    await page.route('**/api/billing/payment-methods', async route => {
      await route.fulfill({
        json: [
          { id: '1', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2025, isDefault: true }
        ]
      });
    });

    await page.route('**/api/billing/invoices', async route => {
      await route.fulfill({
        json: [
          { id: 'inv_1', amount: 29.99, status: 'paid', date: new Date().toISOString() }
        ]
      });
    });
  });

  test('should display billing summary', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await expect(page.getByText('Pro Plan')).toBeVisible(); // Assuming "Pro" is displayed as "Pro Plan"
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('Visa •••• 4242')).toBeVisible();
  });

  test('should show usage metrics', async ({ page }) => {
    await page.goto('/dashboard/billing');
    // Check for progress bars or text
    await expect(page.getByText('150 / 1000 GB')).toBeVisible();
  });
});
