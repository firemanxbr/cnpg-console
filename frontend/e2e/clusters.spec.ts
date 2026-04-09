import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Clusters', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('lists clusters in the selected namespace', async ({ page }) => {
    await page.goto('/clusters');
    await expect(page.getByRole('heading', { name: 'PostgreSQL Clusters' })).toBeVisible();
    // Should show either cluster cards or the empty state
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

  test('shows + New Cluster button', async ({ page }) => {
    await page.goto('/clusters');
    await expect(page.getByRole('button', { name: '+ New Cluster' })).toBeVisible();
  });

  test('opens create cluster form', async ({ page }) => {
    await page.goto('/clusters');
    await page.getByRole('button', { name: '+ New Cluster' }).click();
    await expect(page.getByRole('heading', { name: 'Create Cluster' })).toBeVisible();
    await expect(page.getByPlaceholder('my-pg')).toBeVisible();
  });

  test('create cluster form has required fields', async ({ page }) => {
    await page.goto('/clusters');
    await page.getByRole('button', { name: '+ New Cluster' }).click();
    // Create button should be disabled when name is empty
    await expect(page.getByRole('button', { name: 'Create Cluster' })).toBeDisabled();
    // Fill in name
    await page.getByPlaceholder('my-pg').fill('test-from-e2e');
    await expect(page.getByRole('button', { name: 'Create Cluster' })).toBeEnabled();
    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Create Cluster' })).not.toBeVisible();
  });

  test('cluster card links to detail page', async ({ page }) => {
    await page.goto('/clusters');
    // If there are cluster cards, click the first one
    const card = page.locator('a.card').first();
    if (await card.isVisible()) {
      const name = await card.locator('h3').textContent();
      await card.click();
      await expect(page).toHaveURL(new RegExp(`/clusters/${name}`));
      await expect(page.getByText('Overview')).toBeVisible();
    }
  });
});
