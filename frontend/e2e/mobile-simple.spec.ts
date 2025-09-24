import { test, expect } from '@playwright/test';

// Simple mobile responsiveness tests that work with existing Playwright projects

test('HomePage should be responsive', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verificar se a página carregou
  await expect(page.locator('body')).toBeVisible();

  // Verificar elementos principais (flexível para diferentes estruturas)
  const mainContent = page.locator('main, #__next, .main-content, [role="main"], .container');
  const hasMainContent = await mainContent.count() > 0;
  
  if (hasMainContent) {
    await expect(mainContent.first()).toBeVisible();
  }

  // Verificar se não há overflow horizontal crítico
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = page.viewportSize()?.width || 0;
  
  // Para mobile, permitir uma pequena margem para scrollbars
  const tolerance = viewportWidth < 768 ? 50 : 20;
  expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + tolerance);
});

test('Touch targets should be adequate for mobile', async ({ page }) => {
  const viewportWidth = page.viewportSize()?.width || 0;
  
  // Só executar teste de touch targets em viewports móveis
  if (viewportWidth < 768) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar botões e links visíveis
    const touchTargets = page.locator('button:visible, a:visible, [role="button"]:visible');
    const count = await touchTargets.count();

    if (count > 0) {
      // Testar primeiros 5 elementos
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = touchTargets.nth(i);
        const box = await element.boundingBox();
        
        if (box && box.width > 0 && box.height > 0) {
          // Touch target deve ter pelo menos 30px para mobile
          const hasAdequateSize = box.width >= 30 || box.height >= 30;
          const hasAdequateArea = (box.width * box.height) >= 900; // 30x30
          expect(hasAdequateSize || hasAdequateArea).toBeTruthy();
        }
      }
    }
  } else {
    // Skip test on desktop
    test.skip();
  }
});

test('Text should be readable on all devices', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verificar texto principal
  const headings = page.locator('h1, h2, h3');
  const count = await headings.count();

  if (count > 0) {
    const firstHeading = headings.first();
    if (await firstHeading.isVisible()) {
      const fontSize = await firstHeading.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize);
      });
      
      // Headings devem ter pelo menos 16px
      expect(fontSize).toBeGreaterThanOrEqual(16);
    }
  }
});

test('Should have proper mobile meta tags', async ({ page }) => {
  await page.goto('/');
  
  // Verificar viewport meta tag
  const viewportMeta = page.locator('meta[name="viewport"]');
  await expect(viewportMeta).toHaveCount(1);
  
  const content = await viewportMeta.getAttribute('content');
  expect(content).toContain('width=device-width');
  expect(content).toContain('initial-scale=1');
});

test('Should not have critical console errors', async ({ page }) => {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Filter out common development warnings that are not critical
  const criticalErrors = errors.filter(error => 
    !error.includes('404') && 
    !error.includes('favicon.ico') &&
    !error.includes('sw.js') &&
    !error.includes('workbox') &&
    !error.includes('manifest.json') &&
    !error.toLowerCase().includes('warning')
  );
  
  // Log non-critical errors for debugging
  if (errors.length > 0) {
    console.log('Console messages:', errors);
  }
  
  expect(criticalErrors.length).toBe(0);
});

test('Page should load within reasonable time', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  
  const loadTime = Date.now() - startTime;
  
  // Allow up to 5 seconds for development server
  expect(loadTime).toBeLessThan(5000);
});

test('Should handle different orientations', async ({ page }) => {
  const originalViewport = page.viewportSize();
  
  // Test portrait
  if (originalViewport && originalViewport.width < 768) {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bodyPortrait = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyPortrait).toBeLessThanOrEqual(400); // 375 + tolerance
    
    // Test landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const bodyLandscape = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyLandscape).toBeLessThanOrEqual(690); // 667 + tolerance
    
    // Restore original viewport
    if (originalViewport) {
      await page.setViewportSize(originalViewport);
    }
  } else {
    // Skip orientation test on desktop
    test.skip();
  }
});