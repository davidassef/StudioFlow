import { test, expect } from '@playwright/test';

test.describe('Sistema de Reservas', () => {
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

    // Mock do estúdio para reserva
    await page.route('**/api/studios/1/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
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
          },
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

    // Mock de horários disponíveis
    await page.route('**/api/studios/1/availability/', async route => {
      const url = new URL(route.request().url());
      const date = url.searchParams.get('date');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          available_slots: [
            { start_time: '09:00', end_time: '10:00', available: true },
            { start_time: '10:00', end_time: '11:00', available: true },
            { start_time: '11:00', end_time: '12:00', available: false },
            { start_time: '14:00', end_time: '15:00', available: true },
            { start_time: '15:00', end_time: '16:00', available: true },
            { start_time: '16:00', end_time: '17:00', available: true }
          ]
        })
      });
    });
  });

  test('deve exibir formulário de reserva', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar elementos do formulário
    await expect(page.locator('h1:has-text("Nova Reserva")')).toBeVisible();
    await expect(page.locator('text=Estúdio Alpha')).toBeVisible();
    await expect(page.locator('text=R$ 150,00/hora')).toBeVisible();
    
    // Verificar campos do formulário
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('select[name="start_time"]')).toBeVisible();
    await expect(page.locator('select[name="end_time"]')).toBeVisible();
    await expect(page.locator('textarea[name="notes"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Tentar submeter formulário vazio
    await page.click('button[type="submit"]');
    
    // Verificar mensagens de erro
    await expect(page.locator('text=Data é obrigatória')).toBeVisible();
    await expect(page.locator('text=Horário de início é obrigatório')).toBeVisible();
    await expect(page.locator('text=Horário de término é obrigatório')).toBeVisible();
  });

  test('deve validar data no passado', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Selecionar data no passado
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', yesterdayStr);
    await page.selectOption('select[name="start_time"]', '10:00');
    await page.selectOption('select[name="end_time"]', '12:00');
    
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Data não pode ser no passado')).toBeVisible();
  });

  test('deve validar duração mínima de 1 hora', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Selecionar data futura
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', tomorrowStr);
    await page.selectOption('select[name="start_time"]', '10:00');
    await page.selectOption('select[name="end_time"]', '10:30');
    
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Duração mínima é de 1 hora')).toBeVisible();
  });

  test('deve calcular preço total corretamente', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Selecionar data futura
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', tomorrowStr);
    await page.selectOption('select[name="start_time"]', '10:00');
    await page.selectOption('select[name="end_time"]', '12:00');
    
    // Verificar cálculo do preço (2 horas × R$ 150,00 = R$ 300,00)
    await expect(page.locator('text=Total: R$ 300,00')).toBeVisible();
  });

  test('deve criar reserva com sucesso', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Mock da criação da reserva
    await page.route('**/api/bookings/', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            studio: 1,
            user: 1,
            date: '2025-01-15',
            start_time: '10:00:00',
            end_time: '12:00:00',
            total_price: 300.00,
            status: 'pending',
            notes: 'Sessão de gravação',
            created_at: '2025-01-14T10:00:00Z'
          })
        });
      }
    });
    
    // Preencher formulário
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', tomorrowStr);
    await page.selectOption('select[name="start_time"]', '10:00');
    await page.selectOption('select[name="end_time"]', '12:00');
    await page.fill('textarea[name="notes"]', 'Sessão de gravação');
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de sucesso
    await expect(page.locator('text=Reserva criada com sucesso')).toBeVisible();
    
    // Verificar redirecionamento
    await expect(page).toHaveURL('/dashboard');
  });

  test('deve exibir erro quando horário não está disponível', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Mock de erro de conflito
    await page.route('**/api/bookings/', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Horário não disponível'
          })
        });
      }
    });
    
    // Preencher formulário
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', tomorrowStr);
    await page.selectOption('select[name="start_time"]', '11:00');
    await page.selectOption('select[name="end_time"]', '12:00');
    
    // Submeter formulário
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=Horário não disponível')).toBeVisible();
  });

  test('deve cancelar reserva', async ({ page }) => {
    // Mock de reservas do usuário
    await page.route('**/api/bookings/', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            results: [
              {
                id: 1,
                studio: {
                  id: 1,
                  name: 'Estúdio Alpha',
                  location: 'São Paulo, SP'
                },
                date: '2025-01-15',
                start_time: '10:00:00',
                end_time: '12:00:00',
                total_price: 300.00,
                status: 'pending',
                notes: 'Sessão de gravação'
              }
            ],
            count: 1
          })
        });
      }
    });
    
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar reserva na lista
    await expect(page.locator('text=Estúdio Alpha')).toBeVisible();
    await expect(page.locator('text=15/01/2025')).toBeVisible();
    await expect(page.locator('text=10:00 - 12:00')).toBeVisible();
    
    // Mock do cancelamento
    await page.route('**/api/bookings/1/cancel/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          status: 'cancelled'
        })
      });
    });
    
    // Clicar no botão de cancelar
    await page.click('button:has-text("Cancelar")');
    
    // Confirmar cancelamento
    await page.click('button:has-text("Confirmar Cancelamento")');
    
    // Verificar mensagem de sucesso
    await expect(page.locator('text=Reserva cancelada com sucesso')).toBeVisible();
  });

  test('deve exibir estado de carregamento', async ({ page }) => {
    await page.goto('/studios/1/booking');
    
    // Verificar skeleton/loading durante carregamento
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Verificar que o loading desapareceu
    await expect(page.locator('[data-testid="loading-skeleton"]')).not.toBeVisible();
  });
});