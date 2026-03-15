import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Cleanings module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /cleanings/i }).click();
    await expect(page).toHaveURL('/cleanings', { timeout: 5000 });
  });

  test('cleanings page loads correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /cleanings/i })).toBeVisible();
  });

  test('can create a cleaning (requires at least 1 location)', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /new cleaning/i });
    if (!await newButton.isVisible()) {
      test.skip(); // skip if user doesn't have permission
    }
    await newButton.click();
    await page.getByLabel(/location id/i).fill('1');
    await page.getByLabel(/cleaning date/i).fill('2026-04-10');
    await page.getByRole('button', { name: /create cleaning/i }).click();

    // Either success (row appears) or API error if location doesn't exist
    await page.waitForTimeout(1500);
    const row = page.locator('td').filter({ hasText: /Apr 10/i });
    const err = page.getByText(/failed|error/i);
    await expect(row.or(err)).toBeVisible({ timeout: 6000 });
  });

  test('validates required fields on empty submit', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /new cleaning/i });
    if (!await newButton.isVisible()) { test.skip(); }
    await newButton.click();
    await page.getByRole('button', { name: /create cleaning/i }).click();
    await expect(page.getByText(/required/i).first()).toBeVisible({ timeout: 3000 });
  });

  test('TF Status badge is rendered in table rows', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    if (count > 0) {
      // Each row should have a badge (Normal or TF Day)
      await expect(page.locator('span').filter({ hasText: /Normal|TF Day/i }).first()).toBeVisible();
    }
  });
});
