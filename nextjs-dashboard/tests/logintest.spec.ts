import { test, expect } from '@playwright/test';
import { assert } from 'console';

test.describe('Login Page', () => {
  test('Should login sucessfully and have correct page titles', async ({ page }) => {
  await page.goto('https://forumproject-flax.vercel.app/');

  await expect(page.getByRole('heading', { name: 'Please log in to continue.' })).toBeVisible();
  
  await page
  .getByPlaceholder('Enter your email address')
  .fill('user@nextmail.com');

  await page
  .getByPlaceholder('Enter password')
  .fill('123456');

  await page.getByRole('button', { name: 'Log in' }).click();
  
  await expect(page).toHaveURL('https://forumproject-flax.vercel.app/dashboard', { timeout: 5000 });

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
})});


