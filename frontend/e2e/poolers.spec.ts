import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Poolers', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows poolers page', async ({ page }) => {
    await page.goto('/poolers');
    await expect(page.getByRole('heading', { name: 'Connection Poolers (PgBouncer)' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ New Pooler' })).toBeVisible();
  });

  test('opens create pooler form', async ({ page }) => {
    await page.goto('/poolers');
    await page.getByRole('button', { name: '+ New Pooler' }).click();
    await expect(page.getByRole('heading', { name: 'Create Pooler' })).toBeVisible();
    await expect(page.getByPlaceholder('my-pooler')).toBeVisible();
    await expect(page.getByLabel('Pool Mode')).toBeVisible();
  });

  test('create button disabled without name and cluster', async ({ page }) => {
    await page.goto('/poolers');
    await page.getByRole('button', { name: '+ New Pooler' }).click();
    await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('create pooler and verify it appears in table', async ({ page }) => {
    await page.goto('/poolers');
    await page.getByRole('button', { name: '+ New Pooler' }).click();

    // Fill form
    await page.getByPlaceholder('my-pooler').fill('e2e-pooler-' + Date.now());
    const clusterSelect = page.getByLabel('Cluster');
    const options = await clusterSelect.locator('option').allTextContents();
    if (options.length <= 1) {
      test.skip();
      return;
    }
    await clusterSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify pooler appears in the table
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
