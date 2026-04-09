import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Cluster Detail', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows cluster detail with tabs', async ({ page }) => {
    await page.goto('/clusters');
    const card = page.locator('a.card').first();
    if (!(await card.isVisible())) {
      test.skip();
      return;
    }
    await card.click();
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Instances')).toBeVisible();
    await expect(page.getByText('Configuration')).toBeVisible();
    await expect(page.getByText('Storage')).toBeVisible();
    await expect(page.getByText('Events')).toBeVisible();
  });

  test('overview tab shows cluster info', async ({ page }) => {
    await page.goto('/clusters');
    const card = page.locator('a.card').first();
    if (!(await card.isVisible())) {
      test.skip();
      return;
    }
    await card.click();
    await expect(page.getByText('Cluster Info')).toBeVisible();
    await expect(page.getByText('Namespace')).toBeVisible();
    await expect(page.getByText('Primary')).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
  });

  test('instances tab shows pods', async ({ page }) => {
    await page.goto('/clusters');
    const card = page.locator('a.card').first();
    if (!(await card.isVisible())) {
      test.skip();
      return;
    }
    await card.click();
    await page.getByText('Instances').click();
    await expect(page.getByText('Pod')).toBeVisible();
    await expect(page.getByText('Role')).toBeVisible();
  });

  test('configuration tab shows postgresql parameters', async ({ page }) => {
    await page.goto('/clusters');
    const card = page.locator('a.card').first();
    if (!(await card.isVisible())) {
      test.skip();
      return;
    }
    await card.click();
    await page.getByText('Configuration').click();
    await expect(page.getByText('PostgreSQL Parameters')).toBeVisible();
  });

  test('events tab shows cluster events', async ({ page }) => {
    await page.goto('/clusters');
    const card = page.locator('a.card').first();
    if (!(await card.isVisible())) {
      test.skip();
      return;
    }
    await card.click();
    await page.getByRole('button', { name: /Events/ }).click();
    await expect(page.getByText('Time')).toBeVisible();
    await expect(page.getByText('Reason')).toBeVisible();
  });

  test('breadcrumb links back to clusters list', async ({ page }) => {
    await page.goto('/clusters');
    const card = page.locator('a.card').first();
    if (!(await card.isVisible())) {
      test.skip();
      return;
    }
    await card.click();
    await page.getByRole('link', { name: 'Clusters' }).click();
    await expect(page).toHaveURL(/\/clusters$/);
  });
});
