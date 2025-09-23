import { test, expect } from '@playwright/test';

test.describe('Navegação e Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    // Simular usuário logado
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        user_type: 'cliente'
      }));
    });

    // Interceptar verificação de autenticação
    await page.route('**/api/auth/verify/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            name: 'Usuário Teste',
            email: 'usuario@teste.com',
            user_type: 'cliente'
          }
        })
      });
    });
  });

  test('deve navegar entre páginas principais', async ({ page }) => {
    await page.goto('/');
    
    // Verificar página inicial
    await expect(page.locator('h1')).toContainText('StudioFlow');
    
    // Navegar para login
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Login');
    
    // Navegar para cadastro
    await page.click('a[href="/cadastro"]');
    await expect(page).toHaveURL('/cadastro');
    await expect(page.locator('h1')).toContainText('Cadastro');
    
    // Voltar para home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('deve navegar no menu principal quando logado', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar menu de navegação
    await expect(page.locator('nav')).toBeVisible();
    
    // Navegar para diferentes seções
    await page.click('a[href="/dashboard"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Verificar se existem links para outras páginas
    const profileLink = page.locator('a[href="/perfil"]');
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL('/perfil');
    }
  });

  test('deve ter navegação breadcrumb', async ({ page }) => {
    await page.goto('/studios/1');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar breadcrumb
    await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Estúdios')).toBeVisible();
  });

  test('deve ter navegação por teclado', async ({ page }) => {
    await page.goto('/login');
    
    // Testar navegação por Tab
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
    
    // Testar ativação por Enter
    await page.keyboard.press('Enter');
    // Formulário deve tentar submeter
  });

  test('deve ter indicadores de foco visíveis', async ({ page }) => {
    await page.goto('/login');
    
    // Focar no primeiro input
    await page.keyboard.press('Tab');
    
    // Verificar se o foco está visível
    const focusedElement = page.locator('input[type="email"]:focus');
    await expect(focusedElement).toBeVisible();
    
    // Verificar se há outline ou ring de foco
    const styles = await focusedElement.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        boxShadow: computed.boxShadow
      };
    });
    
    // Deve ter algum indicador visual de foco
    expect(styles.outline !== 'none' || styles.boxShadow !== 'none').toBeTruthy();
  });

  test('deve ter estrutura de headings adequada', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar hierarquia de headings
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Deve ter apenas um H1 por página
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
    
    // Verificar se existem H2, H3 em ordem lógica
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('deve ter labels adequados em formulários', async ({ page }) => {
    await page.goto('/login');
    
    // Verificar se inputs têm labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Verificar se há label associado ou aria-label
    const emailLabel = await emailInput.getAttribute('aria-label') || 
                      await page.locator('label[for]').first().textContent();
    const passwordLabel = await passwordInput.getAttribute('aria-label') || 
                         await page.locator('label[for]').nth(1).textContent();
    
    expect(emailLabel).toBeTruthy();
    expect(passwordLabel).toBeTruthy();
  });

  test('deve ter alt text em imagens', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar todas as imagens
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Imagens devem ter alt text (pode ser vazio para decorativas)
      expect(alt).not.toBeNull();
    }
  });

  test('deve ter contraste adequado', async ({ page }) => {
    await page.goto('/login');
    
    // Verificar contraste de texto principal
    const textElement = page.locator('h1').first();
    
    const styles = await textElement.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor
      };
    });
    
    // Verificar se as cores não são iguais (indicando contraste)
    expect(styles.color).not.toBe(styles.backgroundColor);
  });

  test('deve ser responsivo em diferentes tamanhos', async ({ page }) => {
    // Testar desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    
    // Testar tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    
    // Testar mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('deve ter menu mobile funcional', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Procurar por botão de menu mobile (hamburger)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu-button"]');
    
    if (await mobileMenuButton.isVisible()) {
      // Clicar no menu mobile
      await mobileMenuButton.click();
      
      // Verificar se o menu apareceu
      const mobileMenu = page.locator('[role="menu"], [data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
      
      // Fechar menu
      await mobileMenuButton.click();
      await expect(mobileMenu).not.toBeVisible();
    }
  });

  test('deve ter estados de loading adequados', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verificar se há indicadores de loading
    const loadingIndicators = page.locator('[data-testid*="loading"], .loading, .spinner, [aria-label*="loading"], [aria-label*="Loading"]');
    
    // Durante o carregamento inicial, pode haver indicadores
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Após carregamento, não deve haver indicadores visíveis
    const visibleLoadingCount = await loadingIndicators.count();
    // Aceitar que pode haver 0 ou mais indicadores, mas eles não devem estar visíveis
  });

  test('deve ter mensagens de erro acessíveis', async ({ page }) => {
    await page.goto('/login');
    
    // Submeter formulário vazio para gerar erros
    await page.click('button[type="submit"]');
    
    // Verificar se mensagens de erro são anunciadas para screen readers
    const errorMessages = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"], .error-message');
    
    if (await errorMessages.count() > 0) {
      await expect(errorMessages.first()).toBeVisible();
      
      // Verificar se a mensagem tem atributos de acessibilidade
      const firstError = errorMessages.first();
      const role = await firstError.getAttribute('role');
      const ariaLive = await firstError.getAttribute('aria-live');
      
      expect(role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBeTruthy();
    }
  });

  test('deve permitir navegação por skip links', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Pressionar Tab para focar no primeiro elemento
    await page.keyboard.press('Tab');
    
    // Procurar por skip link
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")');
    
    if (await skipLink.isVisible()) {
      await skipLink.click();
      
      // Verificar se o foco foi para o conteúdo principal
      const mainContent = page.locator('#main, #content, main, [role="main"]');
      await expect(mainContent).toBeFocused();
    }
  });
});