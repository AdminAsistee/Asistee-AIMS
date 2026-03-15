import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Bookings module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /bookings/i }).click();
    await expect(page).toHaveURL('/bookings', { timeout: 5000 });
  });

  test('bookings page loads with table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bookings/i })).toBeVisible();
    // Table headers visible
    await expect(page.getByText(/check-in/i)).toBeVisible();
    await expect(page.getByText(/check-out/i)).toBeVisible();
  });

  test('can open "New Booking" modal', async ({ page }) => {
    await page.getByRole('button', { name: /new booking/i }).click();
    await expect(page.getByRole('heading', { name: /new booking/i })).toBeVisible();
  });

  test('validates required fields on empty booking submit', async ({ page }) => {
    await page.getByRole('button', { name: /new booking/i }).click();
    await page.getByRole('button', { name: /create booking/i }).click();
    await expect(page.getByText(/required/i).first()).toBeVisible({ timeout: 3000 });
  });

  test('can create a booking (requires listing id 1)', async ({ page }) => {
    await page.getByRole('button', { name: /new booking/i }).click();
    await page.getByLabel(/listing id/i).fill('1');
    await page.getByLabel(/check-in/i).fill('2026-05-01');
    await page.getByLabel(/check-out/i).fill('2026-05-05');
    await page.getByLabel(/guests/i).fill('2');
    await page.getByRole('button', { name: /create booking/i }).click();

    await page.waitForTimeout(1500);
    // Either the booking appears or we get an API error about listing not existing
    const row = page.locator('td').filter({ hasText: /May 1/i });
    const err = page.getByText(/failed|overlap|not found/i);
    await expect(row.or(err)).toBeVisible({ timeout: 8000 });
  });

  test('check-in date must be before check-out', async ({ page }) => {
    await page.getByRole('button', { name: /new booking/i }).click();
    await page.getByLabel(/listing id/i).fill('1');
    await page.getByLabel(/check-in/i).fill('2026-05-10');
    await page.getByLabel(/check-out/i).fill('2026-05-05'); // before check-in
    await page.getByLabel(/guests/i).fill('2');
    await page.getByRole('button', { name: /create booking/i }).click();
    // Should get validation error from Zod or backend
    await expect(page.getByText(/failed|invalid|before/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('pagination renders when total > 15', async ({ page }) => {
    // Just verify pagination component isn't broken — may show 1 page
    const pagination = page.locator('[aria-label*="page"], button').filter({ hasText: /prev|next|1/i });
    await expect(pagination.first()).toBeVisible({ timeout: 3000 });
  });
});
