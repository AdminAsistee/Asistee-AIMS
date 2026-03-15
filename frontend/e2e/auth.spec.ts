import { test, expect } from '@playwright/test';

// ─── Auth Flow ───────────────────────────────────────────────────────────────

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example\.com/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/you@example\.com/i).fill('tech@asistee.com');
    await page.getByLabel(/password/i).fill('aimsasistee');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/', { timeout: 8000 });
    await expect(page.getByText(/Tech Admin/i)).toBeVisible();
  });

  test('invalid credentials shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/you@example\.com/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 5000 });
  });

  test('guest cannot access dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/login/, { timeout: 3000 });
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Navigation (logged in as admin)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/you@example\.com/i).fill('tech@asistee.com');
    await page.getByLabel(/password/i).fill('aimsasistee');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/', { timeout: 8000 });
  });

  test('sidebar shows all expected navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /bookings/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cleanings/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /locations/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /supplies/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /users/i })).toBeVisible();
  });

  test('clicking each nav link loads the correct page', async ({ page }) => {
    for (const [name, url] of [
      ['bookings', '/bookings'],
      ['cleanings', '/cleanings'],
      ['locations', '/locations'],
      ['supplies', '/supplies'],
      ['users', '/users'],
    ] as const) {
      await page.getByRole('link', { name: new RegExp(name, 'i') }).click();
      await expect(page).toHaveURL(url, { timeout: 5000 });
    }
  });

  test('sign out clears session and redirects to login', async ({ page }) => {
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/login/, { timeout: 3000 });
    // After logout, / should redirect back to /login
    await page.goto('/');
    await expect(page).toHaveURL(/login/, { timeout: 3000 });
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────────

test.describe('Edge Cases', () => {
  test('login page is responsive at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('double-clicking sign in does not crash', async ({ page }) => {
    await page.goto('/login');
    const button = page.getByRole('button', { name: /sign in/i });
    await button.dblclick();
    await expect(page.locator('body')).toBeVisible();
  });
});
