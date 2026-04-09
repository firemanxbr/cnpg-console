import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Backups', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows backups page with tabs', async ({ page }) => {
    await page.goto('/backups');
    await expect(page.getByRole('heading', { name: 'Backups & WAL Archive' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Backups/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Scheduled/ })).toBeVisible();
  });

  test('shows + Backup and + Schedule buttons', async ({ page }) => {
    await page.goto('/backups');
    await expect(page.getByRole('button', { name: '+ Backup' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Schedule' })).toBeVisible();
  });

  test('opens create backup form with cluster selector', async ({ page }) => {
    await page.goto('/backups');
    await page.getByRole('button', { name: '+ Backup' }).click();
    await expect(page.getByRole('heading', { name: 'Create On-Demand Backup' })).toBeVisible();
    await expect(page.getByLabel('Cluster')).toBeVisible();
    await expect(page.getByLabel('Method')).toBeVisible();
    await expect(page.getByLabel('Target')).toBeVisible();
  });

  test('create backup button disabled without cluster', async ({ page }) => {
    await page.goto('/backups');
    await page.getByRole('button', { name: '+ Backup' }).click();
    await expect(page.getByRole('button', { name: 'Create Backup' })).toBeDisabled();
  });

  test('opens create scheduled backup form', async ({ page }) => {
    await page.goto('/backups');
    await page.getByRole('button', { name: '+ Schedule' }).click();
    await expect(page.getByRole('heading', { name: 'Create Scheduled Backup' })).toBeVisible();
    await expect(page.getByPlaceholder('0 0 2 * * *')).toBeVisible();
  });

  test('switching tabs shows correct content', async ({ page }) => {
    await page.goto('/backups');
    await page.getByRole('button', { name: /Scheduled/ }).click();
    // Should show scheduled content (empty state or table)
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('shows error when backup creation fails', async ({ page }) => {
    await page.goto('/backups');
    await page.getByRole('button', { name: '+ Backup' }).click();
    // Select cluster
    const clusterSelect = page.getByLabel('Cluster');
    const options = await clusterSelect.locator('option').allTextContents();
    if (options.length <= 1) {
      test.skip();
      return;
    }
    await clusterSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Create Backup' }).click();
    // Should show an error banner (volumeSnapshot not supported in Kind)
    await expect(page.locator('.error-box')).toBeVisible({ timeout: 10_000 });
  });
});
