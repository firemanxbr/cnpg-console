import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Replication', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows replication page with tabs', async ({ page }) => {
    await page.goto('/replication');
    await expect(page.getByRole('heading', { name: 'Logical Replication' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Publications/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Subscriptions/ })).toBeVisible();
  });

  test('shows + Publication button on publications tab', async ({ page }) => {
    await page.goto('/replication');
    await expect(page.getByRole('button', { name: '+ Publication' })).toBeVisible();
  });

  test('switches to subscriptions tab', async ({ page }) => {
    await page.goto('/replication');
    await page.getByRole('button', { name: /Subscriptions/ }).click();
    await expect(page.getByRole('button', { name: '+ Subscription' })).toBeVisible();
  });

  test('opens create publication form', async ({ page }) => {
    await page.goto('/replication');
    await page.getByRole('button', { name: '+ Publication' }).click();
    await expect(page.getByRole('heading', { name: 'Create Publication' })).toBeVisible();
  });
});
