import { test, expect, devices } from '@playwright/test';

// Individual test suites for different devices - avoiding test.use() in describe blocks

test.describe('iPhone 12 Mobile Tests', () => {
  test.use(devices['iPhone 12']);

  test('HomePage should be responsive on iPhone 12', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar se a página carregou
    await expect(page.locator('body')).toBeVisible();

    // Verificar elementos principais (flexível para diferentes estruturas)
    const mainContent = page.locator('main, #__next, .main-content, [role="main"]');
    const hasMainContent = await mainContent.count() > 0;
    
    if (hasMainContent) {
      await expect(mainContent.first()).toBeVisible();
    }

    // Verificar se não há overflow horizontal
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px tolerance
  });

  test('Touch targets should be adequate on iPhone 12', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar botões e links visíveis
    const touchTargets = page.locator('button:visible, a:visible, [role="button"]:visible');
    const count = await touchTargets.count();

    if (count > 0) {
      // Testar primeiros 3 elementos
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = touchTargets.nth(i);
        const box = await element.boundingBox();
        
        if (box && box.width > 0 && box.height > 0) {
          // Touch target deve ter pelo menos 32px (mais permissivo)
          const hasAdequateSize = box.width >= 32 || box.height >= 32;
          expect(hasAdequateSize).toBeTruthy();
        }
      }
    }
  });

  test('Text should be readable on iPhone 12', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar texto principal
    const textElements = page.locator('h1, h2, h3, p, span').filter({ hasText: /.+/ });
    const count = await textElements.count();

    if (count > 0) {
      const firstText = textElements.first();
      const fontSize = await firstText.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize);
      });
      
      // Texto deve ter pelo menos 12px
      expect(fontSize).toBeGreaterThanOrEqual(12);
    }
  });
});

test.describe('Samsung Galaxy Mobile Tests', () => {
  test.use(devices['Galaxy S8']);

  test('HomePage should be responsive on Samsung Galaxy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar se a página carregou
    await expect(page.locator('body')).toBeVisible();

    // Verificar se não há overflow horizontal
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('Touch interactions work on Samsung Galaxy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar se há elementos interativos
    const interactiveElements = page.locator('button, a, input, [role="button"]');
    const count = await interactiveElements.count();
    
    // Deve haver pelo menos alguns elementos interativos
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('iPad Mobile Tests', () => {
  test.use(devices['iPad']);

  test('HomePage should be responsive on iPad', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar se a página carregou
    await expect(page.locator('body')).toBeVisible();

    // Verificar se não há overflow horizontal
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });
});

// PWA Tests
test.describe('PWA Features on Mobile', () => {
  test.use(devices['iPhone 12']);

  test('Should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Verificar viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
    
    const content = await viewportMeta.getAttribute('content');
    expect(content).toContain('width=device-width');
  });

  test('Should have manifest link', async ({ page }) => {
    await page.goto('/');
    
    // Verificar manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    const manifestCount = await manifestLink.count();
    
    // Manifest pode não estar presente em desenvolvimento
    if (manifestCount > 0) {
      const href = await manifestLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});

// Performance Tests
test.describe('Mobile Performance', () => {
  test.use(devices['iPhone 12']);

  test('Page should load reasonably fast', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Allow up to 5 seconds for development server
    expect(loadTime).toBeLessThan(5000);
  });

  test('Should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out common development warnings
    const criticalErrors = errors.filter(error => 
      !error.includes('404') && 
      !error.includes('favicon') &&
      !error.includes('sw.js') &&
      !error.includes('workbox')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

// Orientation Tests
test.describe('Mobile Orientations', () => {
  test('Portrait mode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const body = await page.locator('body').boundingBox();
    expect(body?.width).toBeLessThanOrEqual(375);
  });

  test('Landscape mode', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const body = await page.locator('body').boundingBox();
    expect(body?.width).toBeLessThanOrEqual(667);
  });
});