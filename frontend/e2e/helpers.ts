import { type Page } from '@playwright/test';

/**
 * Perform dev login by navigating to /login and clicking the dev login button.
 * Waits until the sidebar namespace selector is visible (confirms auth + namespaces loaded).
 */
export async function devLogin(page: Page) {
  await page.goto('/login');
  const devBtn = page.getByRole('button', { name: 'Dev Login (kubectl proxy)' });
  await devBtn.waitFor({ state: 'visible', timeout: 10_000 });
  await devBtn.click();
  // Wait for the namespace selector to appear (confirms auth + namespace fetch)
  await page.locator('.ns-sel').waitFor({ state: 'visible', timeout: 10_000 });
}
