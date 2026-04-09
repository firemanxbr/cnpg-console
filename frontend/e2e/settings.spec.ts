import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows settings page with tabs', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Storage Classes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Image Catalogs' })).toBeVisible();
  });

  test('storage classes tab shows table', async ({ page }) => {
    await page.goto('/settings');
    // Storage classes tab is default
    await expect(page.getByText('Provisioner')).toBeVisible();
    await expect(page.getByText('Reclaim Policy')).toBeVisible();
  });

  test('image catalogs tab shows catalog sections', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: 'Image Catalogs' }).click();
    await expect(page.getByText('Namespace Image Catalogs')).toBeVisible();
    await expect(page.getByText('Cluster-wide Image Catalogs')).toBeVisible();
  });
});
