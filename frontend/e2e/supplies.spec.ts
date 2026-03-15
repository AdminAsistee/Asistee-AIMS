import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Supplies module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /supplies/i }).click();
    await expect(page).toHaveURL('/supplies', { timeout: 5000 });
  });

  test('shows empty state or supply cards', async ({ page }) => {
    await expect(
      page.getByText(/no supply items found/i).or(page.locator('[class*="card"]').first())
    ).toBeVisible({ timeout: 5000 });
  });

  test('can create a new supply item', async ({ page }) => {
    await page.getByRole('button', { name: /new supply/i }).click();
    await page.getByLabel(/name/i).fill('E2E Towels');
    // Set stock fields
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill('20');
    await inputs.nth(1).fill('5');
    await inputs.nth(2).fill('1');
    await page.getByRole('button', { name: /create supply/i }).click();

    await expect(page.getByText(/E2E Towels/i)).toBeVisible({ timeout: 8000 });
  });

  test('stock bars render for a supply item', async ({ page }) => {
    const card = page.locator('text=E2E Towels').first();
    if (await card.isVisible()) {
      // Stock labels should be visible on the card
      await expect(page.getByText(/Ready/i).first()).toBeVisible();
      await expect(page.getByText(/In Use/i).first()).toBeVisible();
    }
  });

  test('validates required name field', async ({ page }) => {
    await page.getByRole('button', { name: /new supply/i }).click();
    await page.getByRole('button', { name: /create supply/i }).click();
    await expect(page.getByText(/name required/i)).toBeVisible({ timeout: 3000 });
  });
});
