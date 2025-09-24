import { test, expect } from '@playwright/test';

test('Simple page test', async ({ page }) => {
  try {
    await page.goto('http://localhost:5102/', { timeout: 5000 });
    const title = await page.title();
    console.log('Title:', title);
    
    const bgVar = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--background');
    });
    console.log('Background var:', bgVar);
    
    const primaryVar = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--primary');
    });
    console.log('Primary var:', primaryVar);
    
    // If we get variables, test passed
    expect(bgVar.length > 0 || primaryVar.length > 0).toBeTruthy();
  } catch (error) {
    console.log('Test error:', error);
    throw error;
  }
});