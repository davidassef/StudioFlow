import { test, expect } from '@playwright/test';

test('Debug mobile overflow issue', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Get all elements and their scroll widths
  const elementWidths = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const widths: Array<{selector: string, width: number, scrollWidth: number}> = [];
    
    elements.forEach((el, index) => {
      const element = el as HTMLElement;
      if (element.scrollWidth > 400) { // Only elements wider than mobile viewport
        widths.push({
          selector: element.tagName + (element.className ? `.${element.className.split(' ')[0]}` : '') + (element.id ? `#${element.id}` : ''),
          width: element.offsetWidth,
          scrollWidth: element.scrollWidth
        });
      }
    });
    
    return widths.sort((a, b) => b.scrollWidth - a.scrollWidth);
  });

  console.log('Elements causing horizontal overflow:');
  elementWidths.forEach((item, index) => {
    if (index < 10) { // Show top 10
      console.log(`${item.selector}: ${item.scrollWidth}px (offset: ${item.width}px)`);
    }
  });

  // Check body scroll width
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  console.log('Body scroll width:', bodyScrollWidth);

  // Check viewport width
  const viewport = page.viewportSize();
  console.log('Viewport width:', viewport?.width);

  // Take screenshot for visual inspection
  await page.screenshot({ 
    path: 'debug-mobile-overflow.png',
    fullPage: true 
  });

  expect(elementWidths.length).toBeGreaterThan(0);
});