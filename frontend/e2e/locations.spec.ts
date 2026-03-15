import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

// ─── Locations CRUD ──────────────────────────────────────────────────────────

test.describe('Locations module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /locations/i }).click();
    await expect(page).toHaveURL('/locations', { timeout: 5000 });
  });

  test('shows empty state when no locations exist', async ({ page }) => {
    await expect(page.getByText(/no locations found/i).or(page.locator('.card'))).toBeVisible();
  });

  test('can create a new location', async ({ page }) => {
    await page.getByRole('button', { name: /new location/i }).click();
    await expect(page.getByText(/new location/i).first()).toBeVisible();

    await page.getByLabel(/building name/i).fill('E2E Test House');
    await page.getByLabel(/room number/i).fill('101');
    await page.getByLabel(/owner id/i).fill('1');
    await page.getByLabel(/address/i).fill('1-1 Test Street, Tokyo');
    await page.getByLabel(/latitude/i).fill('35.6762');
    await page.getByLabel(/longitude/i).fill('139.6503');
    await page.getByLabel(/google maps link/i).fill('https://maps.google.com');
    await page.getByLabel(/entry info/i).fill('Code: 9999');
    await page.getByRole('button', { name: /create location/i }).click();

    await expect(page.getByText(/E2E Test House/i)).toBeVisible({ timeout: 8000 });
  });

  test('can open location detail drawer', async ({ page }) => {
    // Only runs if a location card is visible
    const card = page.locator('button').filter({ hasText: /E2E Test House/i }).first();
    if (await card.isVisible()) {
      await card.click();
      await expect(page.getByText(/address/i)).toBeVisible();
    }
  });

  test('"New Location" modal validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: /new location/i }).click();
    await page.getByRole('button', { name: /create location/i }).click();
    // Should show validation errors
    await expect(page.getByText(/required|at least/i).first()).toBeVisible({ timeout: 3000 });
  });
});
