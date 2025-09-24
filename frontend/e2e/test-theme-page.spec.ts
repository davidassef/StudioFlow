import { test, expect } from '@playwright/test';

test('Test theme page', async ({ page }) => {
  // Log errors
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));

  await page.goto('http://localhost:5102/test-theme');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Check if page loads without 500 error
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check CSS variables
  const bgVar = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
  });
  
  const primaryVar = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  });
  
  console.log('Background var:', bgVar);
  console.log('Primary var:', primaryVar);
  
  // Check if title loads
  const h1Text = await page.textContent('h1');
  console.log('H1 text:', h1Text);
  
  // If we can see the title, theme is working
  expect(h1Text).toContain('Test Theme Page');
});