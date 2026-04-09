import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('shows login page with SSO and dev login buttons', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'CNPG Console' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in with SSO' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dev Login (kubectl proxy)' })).toBeVisible();
  });

  test('dev login redirects to clusters page with sidebar', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Dev Login (kubectl proxy)' }).click();
    await expect(page).toHaveURL(/\/clusters/);
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.ns-sel')).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/clusters');
    await expect(page).toHaveURL(/\/login/);
  });

  test('logout returns to login page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Dev Login (kubectl proxy)' }).click();
    await page.locator('.ns-sel').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
