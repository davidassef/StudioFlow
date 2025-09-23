import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('/');
  });

  test('deve exibir página de login', async ({ page }) => {
    // Verificar se a página de login está acessível
    await page.goto('/login');
    
    // Verificar elementos da página de login
    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve exibir página de cadastro', async ({ page }) => {
    // Navegar para página de cadastro
    await page.goto('/cadastro');
    
    // Verificar elementos da página de cadastro
    await expect(page.locator('h1')).toContainText('Cadastro');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve validar campos obrigatórios no login', async ({ page }) => {
    await page.goto('/login');
    
    // Tentar submeter formulário vazio
    await page.click('button[type="submit"]');
    
    // Verificar mensagens de erro
    await expect(page.locator('text=Email é obrigatório')).toBeVisible();
    await expect(page.locator('text=Senha é obrigatória')).toBeVisible();
  });

  test('deve validar formato de email', async ({ page }) => {
    await page.goto('/login');
    
    // Preencher email inválido
    await page.fill('input[type="email"]', 'email-invalido');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Email deve ter um formato válido')).toBeVisible();
  });

  test('deve realizar login com credenciais válidas', async ({ page }) => {
    await page.goto('/login');
    
    // Preencher credenciais válidas
    await page.fill('input[type="email"]', 'usuario@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    
    // Interceptar requisição de login
    await page.route('**/api/auth/login/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'fake-access-token',
          refresh: 'fake-refresh-token',
          user: {
            id: 1,
            name: 'Usuário Teste',
            email: 'usuario@teste.com',
            user_type: 'cliente'
          }
        })
      });
    });
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar redirecionamento para dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('deve exibir erro para credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    
    // Preencher credenciais inválidas
    await page.fill('input[type="email"]', 'usuario@teste.com');
    await page.fill('input[type="password"]', 'senha-errada');
    
    // Interceptar requisição de login com erro
    await page.route('**/api/auth/login/', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Credenciais inválidas'
        })
      });
    });
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible();
  });

  test('deve realizar logout', async ({ page }) => {
    // Simular usuário logado
    await page.goto('/dashboard');
    
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
    
    // Aguardar carregamento da página
    await page.waitForLoadState('networkidle');
    
    // Clicar no botão de logout
    await page.click('[data-testid="logout-button"]');
    
    // Verificar redirecionamento para página inicial
    await expect(page).toHaveURL('/');
  });
});