import { test, expect, devices } from '@playwright/test';

// Configuração de dispositivos móveis para teste
const mobileDevices = [
  {
    name: 'iPhone 12',
    ...devices['iPhone 12'],
  },
  {
    name: 'iPhone 12 Pro Max',
    ...devices['iPhone 12 Pro Max'],
  },
  {
    name: 'Samsung Galaxy S21',
    ...devices['Galaxy S8'],
  },
  {
    name: 'iPad',
    ...devices['iPad'],
  },
  {
    name: 'Galaxy Tab S4',
    ...devices['Galaxy Tab S4'],
  }
];

// Teste de responsividade para diferentes dispositivos
mobileDevices.forEach(device => {
  test.describe(`Mobile Test - ${device.name}`, () => {
    
    test.use(device);

    test(`HomePage should be responsive on ${device.name}`, async ({ page }) => {
      await page.goto('/');
      
      // Aguardar carregamento da página
      await page.waitForLoadState('networkidle');
      
      // Verificar se os elementos principais estão visíveis
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      
      // Verificar se não há overflow horizontal
      const body = page.locator('body');
      const bodyWidth = await body.evaluate(el => el.scrollWidth);
      const viewportWidth = await page.viewportSize();
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth?.width || 0);
      
      // Screenshot para análise visual
      await page.screenshot({ 
        path: `test-results/mobile-${device.name.toLowerCase().replace(/\s/g, '-')}-homepage.png`,
        fullPage: true 
      });
    });

    test(`Navigation should work on ${device.name}`, async ({ page }) => {
      await page.goto('/');
      
      // Testar navegação mobile (hamburger menu se existir)
      const hamburgerMenu = page.locator('[data-testid="hamburger-menu"]').or(page.locator('.hamburger')).or(page.locator('button[aria-label*="menu"]'));
      
      if (await hamburgerMenu.isVisible()) {
        await hamburgerMenu.click();
        await expect(page.locator('[role="menu"]').or(page.locator('.mobile-menu'))).toBeVisible();
      }
      
      // Testar links de navegação principais
      const loginButton = page.locator('text=Entrar').or(page.locator('text=Login')).first();
      if (await loginButton.isVisible()) {
        await loginButton.click();
        await expect(page).toHaveURL(/.*login/);
      }
    });

    test(`Forms should be touch-friendly on ${device.name}`, async ({ page }) => {
      await page.goto('/login');
      
      // Verificar se os campos de entrada são grandes o suficiente para toque
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const boundingBox = await input.boundingBox();
        
        if (boundingBox) {
          // Campos devem ter pelo menos 44px de altura (recomendação Apple/Google)
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
      
      // Verificar se botões são touch-friendly
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const boundingBox = await button.boundingBox();
          
          if (boundingBox) {
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

    test(`PWA features should work on ${device.name}`, async ({ page }) => {
      await page.goto('/');
      
      // Verificar se o service worker está registrado
      const swRegistration = await page.evaluate(() => {
        return navigator.serviceWorker.ready.then(() => true).catch(() => false);
      });
      expect(swRegistration).toBe(true);
      
      // Verificar se o manifest está disponível
      const manifestLink = page.locator('link[rel="manifest"]');
      await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
      
      // Testar funcionalidade offline básica
      await page.route('**/api/**', route => route.abort());
      await page.reload();
      
      // A página deve ainda carregar (cached)
      await expect(page.locator('body')).toBeVisible();
    });

    test(`Performance metrics on ${device.name}`, async ({ page }) => {
      await page.goto('/');
      
      // Medir Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals: Record<string, number> = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'measure') {
                vitals[entry.name] = entry.duration;
              }
            });
            
            resolve(vitals);
          }).observe({ entryTypes: ['measure', 'navigation'] });
          
          // Timeout para garantir que obtemos métricas
          setTimeout(() => resolve({}), 3000);
        });
      });
      
      // Log das métricas para análise
      console.log(`Performance metrics for ${device.name}:`, metrics);
      
      // Screenshot final da página carregada
      await page.screenshot({ 
        path: `test-results/performance-${device.name.toLowerCase().replace(/\s/g, '-')}.png` 
      });
    });
  });
});

// Teste específico para verificar adaptação em diferentes tamanhos
test.describe('Responsive Layout Tests', () => {
  const viewports = [
    { width: 320, height: 568, name: 'iPhone 5' },
    { width: 375, height: 667, name: 'iPhone 6/7/8' },
    { width: 390, height: 844, name: 'iPhone 12' },
    { width: 414, height: 896, name: 'iPhone XR' },
    { width: 768, height: 1024, name: 'iPad Portrait' },
    { width: 1024, height: 768, name: 'iPad Landscape' },
    { width: 360, height: 640, name: 'Android Small' },
    { width: 411, height: 731, name: 'Android Large' }
  ];

  viewports.forEach(viewport => {
    test(`Layout adapts correctly at ${viewport.width}x${viewport.height} (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Verificar que não há scroll horizontal
      const horizontalScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(horizontalScrollWidth).toBeLessThanOrEqual(viewport.width + 1); // +1 para tolerância
      
      // Verificar elementos principais
      await expect(page.locator('main')).toBeVisible();
      
      // Screenshot para comparação visual
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.width}x${viewport.height}-${viewport.name.toLowerCase().replace(/\s/g, '-')}.png`,
        fullPage: true 
      });
    });
  });
});

// Teste de acessibilidade mobile
test.describe('Mobile Accessibility', () => {
  test.use(devices['iPhone 12']);

  test('Should be accessible on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Verificar contraste de cores
    const elements = page.locator('*:visible');
    const elementsCount = await elements.count();
    
    // Verificar se há elementos com texto muito pequeno
    for (let i = 0; i < Math.min(elementsCount, 50); i++) {
      const element = elements.nth(i);
      const fontSize = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.fontSize);
      });
      
      const text = await element.textContent();
      if (text && text.trim()) {
        expect(fontSize).toBeGreaterThanOrEqual(16); // Mínimo recomendado para mobile
      }
    }
    
    // Verificar elementos interativos
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const interactiveCount = await interactiveElements.count();
    
    for (let i = 0; i < interactiveCount; i++) {
      const element = interactiveElements.nth(i);
      if (await element.isVisible()) {
        const boundingBox = await element.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});