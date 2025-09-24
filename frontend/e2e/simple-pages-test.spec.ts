import { test, expect } from '@playwright/test';

test('Simple pages API test', async ({ page }) => {
  // Log errors
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));

  try {
    await page.goto('http://localhost:5102/simple-test', { timeout: 10000 });
    
    // Check if page loads
    const title = await page.textContent('h1');
    console.log('Page loaded! Title:', title);
    
    // Basic assertion
    expect(title).toContain('Theme Test');
    
    console.log('SUCCESS: Simple page loads correctly!');
  } catch (error) {
    console.log('ERROR: Page failed to load:', error);
    throw error;
  }
});