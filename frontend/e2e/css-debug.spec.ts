import { test, expect } from '@playwright/test';

test('CSS Debug - Check globals.css loading', async ({ page }) => {
  // Log all console messages and errors
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));

  await page.goto('http://localhost:5102/');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Get page HTML to see what's loaded
  const html = await page.content();
  console.log('HTML includes globals.css:', html.includes('globals.css'));
  console.log('HTML includes _next/static:', html.includes('_next/static'));
  
  // Check all stylesheets
  const stylesheets = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(link => ({
      href: (link as HTMLLinkElement).href,
      loaded: (link as HTMLLinkElement).sheet !== null
    }));
  });
  console.log('Stylesheets found:', stylesheets);
  
  // Check for style tags
  const styleTags = await page.evaluate(() => {
    const styles = Array.from(document.querySelectorAll('style'));
    return styles.map((style, i) => ({
      index: i,
      id: style.id || 'no-id',
      length: style.textContent?.length || 0,
      hasRootVars: style.textContent?.includes(':root') || false,
      hasPrimary: style.textContent?.includes('--primary') || false,
      preview: style.textContent?.slice(0, 200) || ''
    }));
  });
  console.log('Style tags:', styleTags);
  
  // Try to get all CSS custom properties
  const allCSSVars = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const vars: any = {};
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        vars[prop] = styles.getPropertyValue(prop).trim();
      }
    }
    return vars;
  });
  console.log('CSS Variables found:', Object.keys(allCSSVars).length);
  console.log('Background var:', allCSSVars['--background']);
  console.log('Primary var:', allCSSVars['--primary']);
  
  // Check if Tailwind classes work
  const tailwindTest = await page.evaluate(() => {
    const testDiv = document.createElement('div');
    testDiv.className = 'bg-black text-white';
    document.body.appendChild(testDiv);
    const computed = getComputedStyle(testDiv);
    document.body.removeChild(testDiv);
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color
    };
  });
  console.log('Tailwind test:', tailwindTest);
  
  expect(true).toBeTruthy(); // Always pass, we're just debugging
});