import { test, expect, Page } from '@playwright/test';

// ─── Shared login helper ─────────────────────────────────────────────────────
export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder(/you@example\.com/i).fill('tech@asistee.com');
  await page.getByLabel(/password/i).fill('aimsasistee');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/', { timeout: 8000 });
}
