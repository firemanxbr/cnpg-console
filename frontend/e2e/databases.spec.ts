import { test, expect } from '@playwright/test';
import { devLogin } from './helpers';

test.describe('Databases', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page);
  });

  test('shows databases page', async ({ page }) => {
    await page.goto('/databases');
    await expect(page.getByRole('heading', { name: 'Databases' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ New Database' })).toBeVisible();
  });

  test('opens create database form', async ({ page }) => {
    await page.goto('/databases');
    await page.getByRole('button', { name: '+ New Database' }).click();
    await expect(page.getByRole('heading', { name: 'Create Database' })).toBeVisible();
    await expect(page.getByPlaceholder('mydb')).toBeVisible();
    await expect(page.getByPlaceholder('app')).toBeVisible();
  });

  test('create button disabled without required fields', async ({ page }) => {
    await page.goto('/databases');
    await page.getByRole('button', { name: '+ New Database' }).click();
    await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled();
  });
});
