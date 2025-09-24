import { test, expect } from '@playwright/test';

test.describe('Theme debug', () => {
  test('Debug CSS variables and styles', async ({ page }) => {
    // Try a simple 404 page to avoid complex component issues
    await page.goto('/test-page-that-does-not-exist');
    
    // Debug: Check if page loaded correctly
    const title = await page.title();
    console.log('Page title:', title);
    
    // Debug: Get the raw HTML content
    const bodyContent = await page.evaluate(() => document.body.innerHTML.slice(0, 500));
    console.log('Body content (first 500 chars):', bodyContent);
    
    // Debug: Check if there are any errors in console
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    // Wait a bit for all resources to load
    await page.waitForTimeout(2000);
    
    // Debug: Get all CSS custom properties from documentElement
    const allCSSProps = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const props: { [key: string]: string } = {};
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--')) {
          props[prop] = styles.getPropertyValue(prop);
        }
      }
      return props;
    });
    
    console.log('All CSS custom properties:', allCSSProps);
    
    // Debug: Check if globals.css is loaded
    const hasGlobalStyles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
      return links.map(link => link.href);
    });
    
    console.log('Loaded stylesheets:', hasGlobalStyles);
    
    // Debug: Check for any style tags
    const styleTags = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('style'));
      return styles.map(style => ({
        id: style.id || 'no-id',
        length: style.textContent?.length || 0,
        preview: style.textContent?.slice(0, 200) || ''
      }));
    });
    
    console.log('Style tags found:', styleTags);
    
    // Debug: Check specific variables
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--background'));
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary'));
    
    console.log('--background:', bg);
    console.log('--primary:', primary);
    
    // Check for elements with gold classes
    const goldElements = await page.evaluate(() => {
      const goldClasses = ['gold-text', 'gold-bg', 'btn-gold'];
      const found: any[] = [];
      goldClasses.forEach(cls => {
        const elements = document.querySelectorAll(`.${cls}`);
        found.push({ class: cls, count: elements.length, elements: Array.from(elements).map(el => el.outerHTML.slice(0, 100)) });
      });
      return found;
    });
    
    console.log('Elements with gold classes:', goldElements);
  });
});