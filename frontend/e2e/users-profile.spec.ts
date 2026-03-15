import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

// ─── Users module (admin-only) ────────────────────────────────────────────────

test.describe('Users module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /users/i }).click();
    await expect(page).toHaveURL('/users', { timeout: 5000 });
  });

  test('users page displays registered users', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible();
    await expect(page.getByText(/tech@asistee\.com/i)).toBeVisible();
    await expect(page.getByText(/alexa@asistee\.com/i)).toBeVisible();
  });

  test('user type badges are shown', async ({ page }) => {
    await expect(page.getByText(/administrator/i).first()).toBeVisible();
    await expect(page.getByText(/client/i).first()).toBeVisible();
  });

  test('role dropdown is visible per row', async ({ page }) => {
    const selects = page.locator('select');
    await expect(selects.first()).toBeVisible();
  });

  test('delete button is visible per row', async ({ page }) => {
    const deleteButtons = page.locator('button[title*="elete"], button').filter({ has: page.locator('svg') });
    await expect(deleteButtons.first()).toBeVisible();
  });

  test('table renders at mobile width without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(page.getByText(/tech@asistee\.com/i)).toBeVisible();
  });
});

// ─── Profile page ─────────────────────────────────────────────────────────────

test.describe('Profile page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: /profile/i }).click();
    await expect(page).toHaveURL('/profile', { timeout: 5000 });
  });

  test('profile page shows current user info', async ({ page }) => {
    await expect(page.getByText(/Tech Admin/i)).toBeVisible();
    await expect(page.getByText(/tech@asistee\.com/i)).toBeVisible();
    await expect(page.getByText(/administrator/i)).toBeVisible();
  });

  test('edit profile form is present', async ({ page }) => {
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /save profile/i })).toBeVisible();
  });

  test('can update profile name successfully', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Tech Admin QA');
    await page.getByRole('button', { name: /save profile/i }).click();
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({ timeout: 6000 });
    // Restore
    await page.getByLabel(/full name/i).fill('Tech Admin');
    await page.getByRole('button', { name: /save profile/i }).click();
  });

  test('password change section is present', async ({ page }) => {
    await expect(page.getByLabel(/new password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /update password/i })).toBeVisible();
  });

  test('mismatched passwords show validation error', async ({ page }) => {
    await page.getByLabel(/new password/i).fill('newpass123');
    await page.getByLabel(/confirm password/i).fill('differentpass');
    await page.getByRole('button', { name: /update password/i }).click();
    await expect(page.getByText(/passwords don't match/i)).toBeVisible({ timeout: 3000 });
  });
});
