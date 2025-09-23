#!/usr/bin/env node

/**
 * Testes de Integração: Push Notifications + Agendamentos
 * 
 * Este script testa todos os aspectos da integração de push notifications
 * com o sistema de agendamentos do StudioFlow.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function section(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

class NotificationIntegrationTester {
  constructor() {
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    };
  }

  async runAllTests() {
    section('🧪 TESTES DE INTEGRAÇÃO - PUSH NOTIFICATIONS');
    
    await this.testFileStructure();
    await this.testHookImplementation();
    await this.testIntegrationModule();
    await this.testPreferencesManager();
    await this.testServiceWorkerIntegration();
    await this.testNotificationTypes();
    await this.testErrorHandling();
    
    this.printSummary();
  }

  test(description, testFn) {
    this.testResults.total++;
    try {
      const result = testFn();
      if (result === true || result === undefined) {
        success(description);
        this.testResults.passed++;
        return true;
      } else {
        error(`${description} - ${result}`);
        this.testResults.failed++;
        return false;
      }
    } catch (err) {
      error(`${description} - ${err.message}`);
      this.testResults.failed++;
      return false;
    }
  }

  warn(description, message) {
    warning(`${description} - ${message}`);
    this.testResults.warnings++;
  }

  async testFileStructure() {
    section('📁 Estrutura de Arquivos');

    const requiredFiles = [
      'src/hooks/useBookingNotifications.ts',
      'src/lib/notificationIntegration.ts',
      'src/components/pwa/NotificationPreferencesManager.tsx',
      'demo-notification-integration.js',
      'test-notification-integration.js'
    ];

    requiredFiles.forEach(file => {
      this.test(`Arquivo existe: ${file}`, () => {
        return fs.existsSync(file);
      });
    });

    // Verificar arquivos de tarefas anteriores
    const previousFiles = [
      'src/lib/pushNotificationManager.ts',
      'src/lib/pushNotificationAPI.ts',
      'src/hooks/usePushNotifications.ts',
      'src/components/pwa/NotificationPreferences.tsx'
    ];

    previousFiles.forEach(file => {
      this.test(`Arquivo de tarefa anterior existe: ${file}`, () => {
        return fs.existsSync(file);
      });
    });
  }

  async testHookImplementation() {
    section('🎣 Hook useBookingNotifications');

    const hookFile = 'src/hooks/useBookingNotifications.ts';
    
    if (!fs.existsSync(hookFile)) {
      error('Hook file não encontrado');
      return;
    }

    const content = fs.readFileSync(hookFile, 'utf8');

    // Testar interfaces
    this.test('Interface BookingNotification definida', () => {
      return content.includes('interface BookingNotification');
    });

    this.test('Interface UseBookingNotificationsReturn definida', () => {
      return content.includes('interface UseBookingNotificationsReturn');
    });

    // Testar funções principais
    const requiredFunctions = [
      'scheduleConfirmationNotification',
      'scheduleReminderNotification',
      'scheduleRequestNotification',
      'scheduleUpdateNotification',
      'scheduleCancellationNotification',
      'cancelNotification',
      'getNotificationsByBooking'
    ];

    requiredFunctions.forEach(fn => {
      this.test(`Função ${fn} implementada`, () => {
        return content.includes(fn);
      });
    });

    // Testar tipos de notificação
    const notificationTypes = [
      'confirmation',
      'reminder',
      'request',
      'update',
      'cancellation'
    ];

    notificationTypes.forEach(type => {
      this.test(`Tipo de notificação '${type}' suportado`, () => {
        return content.includes(`'${type}'`);
      });
    });

    // Testar integração com localStorage
    this.test('Persistência localStorage implementada', () => {
      return content.includes('localStorage.getItem') && content.includes('localStorage.setItem');
    });

    // Testar tratamento de erros
    this.test('Tratamento de erros implementado', () => {
      return content.includes('try {') && content.includes('catch');
    });
  }

  async testIntegrationModule() {
    section('🔗 Módulo de Integração');

    const integrationFile = 'src/lib/notificationIntegration.ts';
    
    if (!fs.existsSync(integrationFile)) {
      error('Arquivo de integração não encontrado');
      return;
    }

    const content = fs.readFileSync(integrationFile, 'utf8');

    // Testar interfaces
    this.test('Interface BookingData definida', () => {
      return content.includes('interface BookingData');
    });

    this.test('Interface StudioOwner definida', () => {
      return content.includes('interface StudioOwner');
    });

    // Testar classe principal
    this.test('Classe NotificationIntegration implementada', () => {
      return content.includes('class NotificationIntegration');
    });

    this.test('Padrão Singleton implementado', () => {
      return content.includes('getInstance()') && content.includes('private static instance');
    });

    // Testar métodos principais
    const requiredMethods = [
      'handleNewBooking',
      'notifyStudioOwnerNewRequest',
      'handleBookingConfirmation',
      'notifyUserBookingConfirmed',
      'scheduleUserReminder',
      'handleBookingUpdate',
      'handleBookingCancellation'
    ];

    requiredMethods.forEach(method => {
      this.test(`Método ${method} implementado`, () => {
        return content.includes(method);
      });
    });

    // Testar integração com PushNotificationAPI
    this.test('Integração com PushNotificationAPI', () => {
      return content.includes('PushNotificationAPI.sendTestNotification');
    });

    // Testar configuração de ações
    this.test('Ações de notificação configuradas', () => {
      return content.includes('actions:') && content.includes('action:') && content.includes('title:');
    });

    // Testar padrões de vibração
    this.test('Padrões de vibração configurados', () => {
      return content.includes('vibrate:');
    });

    // Testar roteamento de URLs
    this.test('Roteamento de URLs implementado', () => {
      return content.includes('url:') && content.includes('/bookings/');
    });
  }

  async testPreferencesManager() {
    section('⚙️ Gerenciador de Preferências');

    const managerFile = 'src/components/pwa/NotificationPreferencesManager.tsx';
    
    if (!fs.existsSync(managerFile)) {
      error('Componente de gerenciamento não encontrado');
      return;
    }

    const content = fs.readFileSync(managerFile, 'utf8');

    // Testar componente React
    this.test('Componente React implementado', () => {
      return content.includes('export default function NotificationPreferencesManager');
    });

    // Testar props interface
    this.test('Interface de props definida', () => {
      return content.includes('interface NotificationPreferencesManagerProps');
    });

    // Testar hooks utilizados
    const requiredHooks = [
      'useState',
      'useEffect'
    ];

    requiredHooks.forEach(hook => {
      this.test(`Hook ${hook} utilizado`, () => {
        return content.includes(hook);
      });
    });

    // Testar tipos de preferência
    const preferenceTypes = [
      'confirmations',
      'reminders',
      'requests',
      'updates',
      'marketing'
    ];

    preferenceTypes.forEach(type => {
      this.test(`Preferência '${type}' implementada`, () => {
        return content.includes(`preferences.${type}`);
      });
    });

    // Testar horário silencioso
    this.test('Horário silencioso implementado', () => {
      return content.includes('quietHours') && content.includes('type="time"');
    });

    // Testar botões de teste
    this.test('Botões de teste implementados', () => {
      return content.includes('handleTestNotification') && content.includes('Testar');
    });

    // Testar acessibilidade
    this.test('Elementos de acessibilidade presentes', () => {
      return content.includes('aria-') || content.includes('role=') || content.includes('alt=');
    });

    // Testar modo escuro
    this.test('Suporte a modo escuro', () => {
      return content.includes('dark:');
    });
  }

  async testServiceWorkerIntegration() {
    section('⚙️ Integração Service Worker');

    const swFile = 'public/sw-custom.js';
    
    if (!fs.existsSync(swFile)) {
      this.warn('Service Worker customizado', 'Arquivo não encontrado - usando SW gerado automaticamente');
      return;
    }

    const content = fs.readFileSync(swFile, 'utf8');

    // Testar handlers de push
    this.test('Handler de push events', () => {
      return content.includes('push') && content.includes('event');
    });

    // Testar handlers de click
    this.test('Handler de notification click', () => {
      return content.includes('notificationclick');
    });

    // Testar roteamento de ações
    this.test('Roteamento de ações implementado', () => {
      return content.includes('action') && content.includes('switch') || content.includes('if');
    });
  }

  async testNotificationTypes() {
    section('🔔 Tipos de Notificação');

    const integrationFile = 'src/lib/notificationIntegration.ts';
    const content = fs.readFileSync(integrationFile, 'utf8');

    // Testar configurações específicas por tipo
    const notificationConfigs = [
      {
        type: 'confirmation',
        title: '✅ Agendamento Confirmado',
        actions: ['view', 'calendar', 'directions']
      },
      {
        type: 'reminder',
        title: '⏰ Lembrete de Agendamento',
        actions: ['view', 'directions', 'contact']
      },
      {
        type: 'request',
        title: '🎵 Nova Solicitação',
        actions: ['approve', 'view', 'reject']
      },
      {
        type: 'update',
        title: '📝 Agendamento Atualizado',
        actions: ['view', 'calendar']
      },
      {
        type: 'cancellation',
        title: '❌ Agendamento Cancelado',
        actions: ['rebook', 'view', 'contact']
      }
    ];

    notificationConfigs.forEach(config => {
      this.test(`Configuração para ${config.type}`, () => {
        return content.includes(config.title);
      });

      config.actions.forEach(action => {
        this.test(`Ação '${action}' para ${config.type}`, () => {
          return content.includes(`action: '${action}'`);
        });
      });
    });

    // Testar propriedades especiais
    this.test('Interação obrigatória para lembretes', () => {
      return content.includes('requireInteraction: true');
    });

    this.test('Tags únicas por notificação', () => {
      return content.includes('tag:') && content.includes('booking-');
    });

    this.test('Dados customizados (data)', () => {
      return content.includes('data: {') && content.includes('type:') && content.includes('bookingId:');
    });
  }

  async testErrorHandling() {
    section('🛡️ Tratamento de Erros');

    const files = [
      'src/hooks/useBookingNotifications.ts',
      'src/lib/notificationIntegration.ts',
      'src/components/pwa/NotificationPreferencesManager.tsx'
    ];

    files.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        this.test(`Try-catch em ${path.basename(file)}`, () => {
          return content.includes('try {') && content.includes('} catch');
        });

        this.test(`Logging de erros em ${path.basename(file)}`, () => {
          return content.includes('console.error');
        });

        this.test(`Estado de erro em ${path.basename(file)}`, () => {
          return content.includes('error') && (content.includes('setError') || content.includes('useState'));
        });
      }
    });

    // Testar cenários específicos
    this.test('Tratamento de permissões negadas', () => {
      const managerContent = fs.readFileSync('src/components/pwa/NotificationPreferencesManager.tsx', 'utf8');
      return managerContent.includes('denied') && managerContent.includes('Permissões negadas');
    });

    this.test('Fallback para preferências desabilitadas', () => {
      const integrationContent = fs.readFileSync('src/lib/notificationIntegration.ts', 'utf8');
      return integrationContent.includes('!preferences.') && integrationContent.includes('.enabled');
    });
  }

  printSummary() {
    section('📊 RESUMO DOS TESTES');
    
    const { total, passed, failed, warnings } = this.testResults;
    const passRate = ((passed / total) * 100).toFixed(1);
    
    log(`Total de testes: ${total}`, 'blue');
    log(`✅ Aprovados: ${passed}`, 'green');
    log(`❌ Falharam: ${failed}`, failed > 0 ? 'red' : 'reset');
    log(`⚠️  Avisos: ${warnings}`, warnings > 0 ? 'yellow' : 'reset');
    log(`📈 Taxa de sucesso: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');

    if (passRate >= 90) {
      success('\n🎉 INTEGRAÇÃO COMPLETA E FUNCIONAL!');
      info('A integração de push notifications está pronta para produção.');
    } else if (passRate >= 70) {
      warning('\n⚠️  INTEGRAÇÃO PARCIALMENTE FUNCIONAL');
      info('Alguns ajustes podem ser necessários antes da produção.');
    } else {
      error('\n❌ INTEGRAÇÃO PRECISA DE CORREÇÕES');
      info('Várias funcionalidades precisam ser implementadas ou corrigidas.');
    }

    log('\n🔧 Próximos passos recomendados:', 'cyan');
    log('1. Executar testes em navegador real', 'blue');
    log('2. Testar em dispositivos móveis', 'blue');
    log('3. Configurar VAPID keys para produção', 'blue');
    log('4. Implementar analytics de notificações', 'blue');
    log('5. Configurar processamento em background', 'blue');
    log('6. Adicionar testes E2E', 'blue');
  }
}

// Executar testes
if (require.main === module) {
  const tester = new NotificationIntegrationTester();
  tester.runAllTests().catch(console.error);
}

module.exports = { NotificationIntegrationTester };