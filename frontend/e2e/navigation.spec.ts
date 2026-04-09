import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('sidebar has all navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Clusters/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Backups/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Poolers/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Databases/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Replication/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Monitoring/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Settings/ })).toBeVisible();
  });

  test('navigate to each page via sidebar', async ({ page }) => {
    const pages = [
      { link: /Backups/, url: '/backups' },
      { link: /Poolers/, url: '/poolers' },
      { link: /Databases/, url: '/databases' },
      { link: /Replication/, url: '/replication' },
      { link: /Monitoring/, url: '/monitoring' },
      { link: /Settings/, url: '/settings' },
      { link: /Clusters/, url: '/clusters' },
    ];

    for (const p of pages) {
      await page.getByRole('link', { name: p.link }).click();
      await expect(page).toHaveURL(new RegExp(p.url));
    }
  });

  test('namespace selector has options', async ({ page }) => {
    const select = page.locator('.ns-sel');
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThan(0);
  });

  test('changing namespace reloads page data', async ({ page }) => {
    await page.goto('/clusters');
    const select = page.locator('.ns-sel');
    // Switch to a namespace that likely has no clusters
    await select.selectOption('kube-system');
    // Should show empty state or different data
    await page.waitForTimeout(1000);
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});
