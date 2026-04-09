import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Monitoring', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows monitoring page with tabs', async ({ page }) => {
    await page.goto('/monitoring');
    await expect(page.getByRole('heading', { name: 'Monitoring' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Events/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Pods/ })).toBeVisible();
  });

  test('overview shows health metric cards', async ({ page }) => {
    await page.goto('/monitoring');
    await expect(page.locator('.metric-card').first()).toBeVisible();
    await expect(page.getByText('TOTAL CLUSTERS')).toBeVisible();
    await expect(page.getByText('HEALTHY CLUSTERS')).toBeVisible();
    await expect(page.getByText('READY INSTANCES')).toBeVisible();
    await expect(page.getByText('POSTGRESQL PODS')).toBeVisible();
  });

  test('overview shows cluster health table', async ({ page }) => {
    await page.goto('/monitoring');
    await expect(page.getByText('Cluster Health')).toBeVisible();
  });

  test('events tab shows event list', async ({ page }) => {
    await page.goto('/monitoring');
    await page.getByRole('button', { name: /Events/ }).click();
    // Should show event table headers
    await expect(page.getByText('Time')).toBeVisible();
    await expect(page.getByText('Reason')).toBeVisible();
    await expect(page.getByText('Message')).toBeVisible();
  });

  test('pods tab shows pod list with log button', async ({ page }) => {
    await page.goto('/monitoring');
    await page.getByRole('button', { name: /Pods/ }).click();
    await expect(page.getByText('Pod')).toBeVisible();
    await expect(page.getByText('Role')).toBeVisible();
    // If pods exist, there should be a Logs button
    const logBtn = page.getByRole('button', { name: 'Logs' }).first();
    if (await logBtn.isVisible()) {
      await logBtn.click();
      await expect(page.locator('.logs-panel')).toBeVisible({ timeout: 10_000 });
    }
  });
});
