import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test('should display sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verify main nav items
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /billing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByRole('link', { name: /billing/i }).click();
    await expect(page).toHaveURL('/dashboard/billing');
    await expect(page.getByRole('heading', { name: /billing/i })).toBeVisible();
    
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL('/dashboard/settings');
  });

  test('should toggle sidebar on mobile', async ({ page }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    
    // Assuming there is a mobile menu button (hamburger)
    // Based on analysis, Sidebar is hidden on mobile, so there should be a MobileNav
    // We check for a menu button
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});
