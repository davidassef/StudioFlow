import { test, expect } from '@playwright/test';

test.describe('Busca e Descoberta de Estúdios', () => {
  test.beforeEach(async ({ page }) => {
    // Simular usuário logado
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
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
            name: 'Cliente Teste',
            email: 'cliente@teste.com',
            user_type: 'cliente'
          }
        })
      });
    });

    // Mock de estúdios
    await page.route('**/api/studios/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              name: 'Estúdio Alpha',
              description: 'Estúdio profissional para gravação',
              location: 'São Paulo, SP',
              price_per_hour: 150.00,
              capacity: 10,
              equipment: ['Microfones Profissionais', 'Mesa de Som Digital'],
              images: ['/studio1.jpg'],
              rating: 4.8,
              owner: {
                id: 2,
                name: 'Prestador Teste'
              }
            },
            {
              id: 2,
              name: 'Estúdio Beta',
              description: 'Estúdio para ensaios e gravações',
              location: 'Rio de Janeiro, RJ',
              price_per_hour: 120.00,
              capacity: 8,
              equipment: ['Piano', 'Bateria', 'Amplificadores'],
              images: ['/studio2.jpg'],
              rating: 4.5,
              owner: {
                id: 3,
                name: 'Outro Prestador'
              }
            }
          ],
          count: 2
        })
      });
    });
  });

  test('deve exibir lista de estúdios', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento dos estúdios
    await page.waitForLoadState('networkidle');
    
    // Verificar se os estúdios são exibidos
    await expect(page.locator('text=Estúdio Alpha')).toBeVisible();
    await expect(page.locator('text=Estúdio Beta')).toBeVisible();
    
    // Verificar informações dos estúdios
    await expect(page.locator('text=São Paulo, SP')).toBeVisible();
    await expect(page.locator('text=R$ 150,00/hora')).toBeVisible();
    await expect(page.locator('text=4.8')).toBeVisible();
  });

  test('deve filtrar estúdios por nome', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Interceptar busca filtrada
    await page.route('**/api/studios/?search=Alpha', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              name: 'Estúdio Alpha',
              description: 'Estúdio profissional para gravação',
              location: 'São Paulo, SP',
              price_per_hour: 150.00,
              capacity: 10,
              equipment: ['Microfones Profissionais'],
              images: ['/studio1.jpg'],
              rating: 4.8
            }
          ],
          count: 1
        })
      });
    });
    
    // Buscar por "Alpha"
    await page.fill('input[placeholder*="Buscar"]', 'Alpha');
    await page.press('input[placeholder*="Buscar"]', 'Enter');
    
    // Verificar resultado filtrado
    await expect(page.locator('text=Estúdio Alpha')).toBeVisible();
    await expect(page.locator('text=Estúdio Beta')).not.toBeVisible();
  });

  test('deve filtrar por faixa de preço', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Abrir filtros avançados
    await page.click('button:has-text("Filtros Avançados")');
    
    // Interceptar busca com filtro de preço
    await page.route('**/api/studios/?price_min=100&price_max=130', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 2,
              name: 'Estúdio Beta',
              description: 'Estúdio para ensaios',
              location: 'Rio de Janeiro, RJ',
              price_per_hour: 120.00,
              capacity: 8,
              equipment: ['Piano'],
              images: ['/studio2.jpg'],
              rating: 4.5
            }
          ],
          count: 1
        })
      });
    });
    
    // Definir faixa de preço
    await page.fill('input[placeholder="Preço mínimo"]', '100');
    await page.fill('input[placeholder="Preço máximo"]', '130');
    await page.click('button:has-text("Aplicar Filtros")');
    
    // Verificar resultado filtrado
    await expect(page.locator('text=Estúdio Beta')).toBeVisible();
    await expect(page.locator('text=Estúdio Alpha')).not.toBeVisible();
  });

  test('deve exibir detalhes do estúdio', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Mock para detalhes do estúdio
    await page.route('**/api/studios/1/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Estúdio Alpha',
          description: 'Estúdio profissional para gravação com equipamentos de alta qualidade',
          location: 'São Paulo, SP',
          price_per_hour: 150.00,
          capacity: 10,
          equipment: ['Microfones Profissionais', 'Mesa de Som Digital', 'Piano'],
          images: ['/studio1.jpg', '/studio1-2.jpg'],
          rating: 4.8,
          reviews_count: 25,
          owner: {
            id: 2,
            name: 'Prestador Teste',
            email: 'prestador@teste.com'
          },
          amenities: ['Wi-Fi', 'Ar Condicionado', 'Estacionamento'],
          operating_hours: {
            monday: '08:00-22:00',
            tuesday: '08:00-22:00',
            wednesday: '08:00-22:00',
            thursday: '08:00-22:00',
            friday: '08:00-22:00',
            saturday: '10:00-20:00',
            sunday: 'Fechado'
          }
        })
      });
    });
    
    // Clicar no primeiro estúdio
    await page.click('text=Estúdio Alpha');
    
    // Verificar se a página de detalhes carregou
    await expect(page).toHaveURL(/\/studios\/1/);
    
    // Verificar informações detalhadas
    await expect(page.locator('h1:has-text("Estúdio Alpha")')).toBeVisible();
    await expect(page.locator('text=Estúdio profissional para gravação com equipamentos')).toBeVisible();
    await expect(page.locator('text=R$ 150,00/hora')).toBeVisible();
    await expect(page.locator('text=Capacidade: 10 pessoas')).toBeVisible();
    await expect(page.locator('text=4.8')).toBeVisible();
    await expect(page.locator('text=25 avaliações')).toBeVisible();
    
    // Verificar equipamentos
    await expect(page.locator('text=Microfones Profissionais')).toBeVisible();
    await expect(page.locator('text=Mesa de Som Digital')).toBeVisible();
    
    // Verificar comodidades
    await expect(page.locator('text=Wi-Fi')).toBeVisible();
    await expect(page.locator('text=Ar Condicionado')).toBeVisible();
  });

  test('deve exibir mensagem quando não há estúdios', async ({ page }) => {
    // Mock de resposta vazia
    await page.route('**/api/studios/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [],
          count: 0
        })
      });
    });
    
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar mensagem de lista vazia
    await expect(page.locator('text=Nenhum estúdio encontrado')).toBeVisible();
  });

  test('deve lidar com erro na busca', async ({ page }) => {
    // Mock de erro na API
    await page.route('**/api/studios/', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Erro interno do servidor'
        })
      });
    });
    
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Erro ao carregar estúdios')).toBeVisible();
  });
});