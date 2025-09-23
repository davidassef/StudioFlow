import { test, expect } from '@playwright/test';

test.describe('Dashboard do Prestador', () => {
  test.beforeEach(async ({ page }) => {
    // Simular prestador logado
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        name: 'Prestador Teste',
        email: 'prestador@teste.com',
        user_type: 'prestador'
      }));
    });

    // Interceptar verificação de autenticação
    await page.route('**/api/auth/verify/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 2,
            name: 'Prestador Teste',
            email: 'prestador@teste.com',
            user_type: 'prestador'
          }
        })
      });
    });

    // Mock de estúdios do prestador
    await page.route('**/api/studios/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              name: 'Meu Estúdio Alpha',
              description: 'Estúdio profissional',
              location: 'São Paulo, SP',
              price_per_hour: 150.00,
              capacity: 10,
              equipment: ['Microfones', 'Mesa de Som'],
              images: ['/studio1.jpg'],
              rating: 4.8,
              owner: 2
            },
            {
              id: 2,
              name: 'Meu Estúdio Beta',
              description: 'Estúdio para ensaios',
              location: 'São Paulo, SP',
              price_per_hour: 120.00,
              capacity: 8,
              equipment: ['Piano', 'Bateria'],
              images: ['/studio2.jpg'],
              rating: 4.5,
              owner: 2
            }
          ],
          count: 2
        })
      });
    });

    // Mock de reservas do prestador
    await page.route('**/api/bookings/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              studio: {
                id: 1,
                name: 'Meu Estúdio Alpha'
              },
              user: {
                id: 3,
                name: 'Cliente Teste',
                email: 'cliente@teste.com'
              },
              date: '2025-01-15',
              start_time: '10:00:00',
              end_time: '12:00:00',
              total_price: 300.00,
              status: 'confirmed',
              notes: 'Sessão de gravação',
              created_at: '2025-01-14T10:00:00Z'
            },
            {
              id: 2,
              studio: {
                id: 2,
                name: 'Meu Estúdio Beta'
              },
              user: {
                id: 4,
                name: 'Outro Cliente',
                email: 'outro@teste.com'
              },
              date: '2025-01-16',
              start_time: '14:00:00',
              end_time: '16:00:00',
              total_price: 240.00,
              status: 'pending',
              notes: 'Ensaio de banda',
              created_at: '2025-01-14T15:00:00Z'
            }
          ],
          count: 2
        })
      });
    });

    // Mock de estatísticas
    await page.route('**/api/dashboard/stats/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          monthly_revenue: 2450.00,
          confirmed_bookings: 12,
          pending_bookings: 3,
          occupancy_rate: 78,
          total_studios: 2,
          average_rating: 4.65,
          revenue_growth: 15.5,
          bookings_growth: 8.2
        })
      });
    });
  });

  test('deve exibir dashboard do prestador', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar título
    await expect(page.locator('h1:has-text("Dashboard do Prestador")')).toBeVisible();
    
    // Verificar saudação personalizada
    await expect(page.locator('text=Olá, Prestador Teste')).toBeVisible();
  });

  test('deve exibir métricas principais', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar métricas
    await expect(page.locator('text=R$ 2.450,00')).toBeVisible(); // Receita mensal
    await expect(page.locator('text=12')).toBeVisible(); // Reservas confirmadas
    await expect(page.locator('text=78%')).toBeVisible(); // Taxa de ocupação
    await expect(page.locator('text=4.65')).toBeVisible(); // Avaliação média
    
    // Verificar crescimento
    await expect(page.locator('text=+15.5%')).toBeVisible(); // Crescimento da receita
    await expect(page.locator('text=+8.2%')).toBeVisible(); // Crescimento das reservas
  });

  test('deve exibir lista de reservas recentes', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar seção de reservas
    await expect(page.locator('text=Reservas Recentes')).toBeVisible();
    
    // Verificar reservas específicas
    await expect(page.locator('text=Cliente Teste')).toBeVisible();
    await expect(page.locator('text=Meu Estúdio Alpha')).toBeVisible();
    await expect(page.locator('text=15/01/2025')).toBeVisible();
    await expect(page.locator('text=10:00 - 12:00')).toBeVisible();
    await expect(page.locator('text=R$ 300,00')).toBeVisible();
    
    // Verificar status das reservas
    await expect(page.locator('text=Confirmada')).toBeVisible();
    await expect(page.locator('text=Pendente')).toBeVisible();
  });

  test('deve exibir gráficos de performance', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar seções de gráficos
    await expect(page.locator('text=Receita Mensal')).toBeVisible();
    await expect(page.locator('text=Reservas por Dia')).toBeVisible();
    await expect(page.locator('text=Uso por Estúdio')).toBeVisible();
    await expect(page.locator('text=Horários Mais Populares')).toBeVisible();
    
    // Verificar se os gráficos estão renderizados (elementos SVG do Recharts)
    await expect(page.locator('svg')).toBeVisible();
  });

  test('deve permitir gerenciar estúdios', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar seção de estúdios
    await expect(page.locator('text=Meus Estúdios')).toBeVisible();
    await expect(page.locator('text=Meu Estúdio Alpha')).toBeVisible();
    await expect(page.locator('text=Meu Estúdio Beta')).toBeVisible();
    
    // Verificar botões de ação
    await expect(page.locator('button:has-text("Editar")')).toBeVisible();
    await expect(page.locator('button:has-text("Ver Detalhes")')).toBeVisible();
    
    // Verificar botão de adicionar novo estúdio
    await expect(page.locator('button:has-text("Adicionar Estúdio")')).toBeVisible();
  });

  test('deve confirmar reserva pendente', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Mock da confirmação
    await page.route('**/api/bookings/2/confirm/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 2,
          status: 'confirmed'
        })
      });
    });
    
    // Encontrar reserva pendente e confirmar
    const pendingBooking = page.locator('text=Pendente').locator('..');
    await pendingBooking.locator('button:has-text("Confirmar")')?.click();
    
    // Verificar mensagem de sucesso
    await expect(page.locator('text=Reserva confirmada com sucesso')).toBeVisible();
  });

  test('deve rejeitar reserva pendente', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Mock da rejeição
    await page.route('**/api/bookings/2/reject/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 2,
          status: 'rejected'
        })
      });
    });
    
    // Encontrar reserva pendente e rejeitar
    const pendingBooking = page.locator('text=Pendente').locator('..');
    await pendingBooking.locator('button:has-text("Rejeitar")')?.click();
    
    // Confirmar rejeição
    await page.click('button:has-text("Confirmar Rejeição")');
    
    // Verificar mensagem de sucesso
    await expect(page.locator('text=Reserva rejeitada')).toBeVisible();
  });

  test('deve navegar para cadastro de estúdio', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Clicar no botão de adicionar estúdio
    await page.click('button:has-text("Adicionar Estúdio")');
    
    // Verificar redirecionamento
    await expect(page).toHaveURL('/cadastro-estudio');
  });

  test('deve exibir insights e recomendações', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar seção de insights
    await expect(page.locator('text=Insights e Recomendações')).toBeVisible();
    
    // Verificar algumas recomendações típicas
    await expect(page.locator('text=horários mais populares')).toBeVisible();
    await expect(page.locator('text=receita')).toBeVisible();
  });

  test('deve atualizar dados manualmente', async ({ page }) => {
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Clicar no botão de atualizar
    await page.click('button:has-text("Atualizar")');
    
    // Verificar que os dados foram recarregados
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });

  test('deve lidar com erro no carregamento', async ({ page }) => {
    // Mock de erro na API
    await page.route('**/api/dashboard/stats/', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Erro interno do servidor'
        })
      });
    });
    
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Erro ao carregar dados')).toBeVisible();
    
    // Verificar botão de tentar novamente
    await expect(page.locator('button:has-text("Tentar Novamente")')).toBeVisible();
  });

  test('deve ter responsividade mobile', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard-prestador');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que o conteúdo está visível em mobile
    await expect(page.locator('h1:has-text("Dashboard do Prestador")')).toBeVisible();
    await expect(page.locator('text=R$ 2.450,00')).toBeVisible();
    
    // Verificar que os gráficos se adaptam
    await expect(page.locator('svg')).toBeVisible();
  });
});