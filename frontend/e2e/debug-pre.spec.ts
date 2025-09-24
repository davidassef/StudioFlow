import { test, expect } from '@playwright/test';

test('Debug PRE element overflow', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Find the PRE element and get its details
  const preElementInfo = await page.evaluate(() => {
    const preElements = document.querySelectorAll('pre');
    const info: any[] = [];
    
    preElements.forEach((pre, index) => {
      const element = pre as HTMLElement;
      info.push({
        index,
        innerHTML: element.innerHTML.substring(0, 200) + '...', // First 200 chars
        textContent: element.textContent?.substring(0, 200) + '...',
        width: element.offsetWidth,
        scrollWidth: element.scrollWidth,
        className: element.className,
        id: element.id,
        parentElement: element.parentElement?.tagName + '.' + (element.parentElement?.className || ''),
        styles: {
          display: getComputedStyle(element).display,
          position: getComputedStyle(element).position,
          width: getComputedStyle(element).width,
          maxWidth: getComputedStyle(element).maxWidth,
          whiteSpace: getComputedStyle(element).whiteSpace,
          overflow: getComputedStyle(element).overflow
        }
      });
    });
    
    return info;
  });

  console.log('PRE elements found:', preElementInfo.length);
  preElementInfo.forEach((info, index) => {
    console.log(`\nPRE ${index}:`, {
      width: info.width,
      scrollWidth: info.scrollWidth,
      className: info.className,
      parent: info.parentElement,
      styles: info.styles,
      content: info.textContent?.substring(0, 100)
    });
  });

  // Check if it's related to error messages or logs
  const errorElements = await page.locator('pre, code, .error, [class*="error"]').all();
  console.log('Error-related elements:', errorElements.length);

  expect(true).toBeTruthy(); // Always pass, this is for debugging
});