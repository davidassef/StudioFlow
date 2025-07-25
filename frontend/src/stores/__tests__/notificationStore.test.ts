import { renderHook, act } from '@testing-library/react';
import { useNotificationStore, useNotifications, Notification } from '../notificationStore';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do Date.now para testes consistentes
const mockDate = new Date('2024-01-15T10:00:00.000Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
Date.now = jest.fn(() => mockDate.getTime());

describe('notificationStore', () => {
  beforeEach(() => {
    // Limpar o store antes de cada teste
    const { result } = renderHook(() => useNotificationStore());
    act(() => {
      result.current.clearAllNotifications();
    });
    jest.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve inicializar com estado vazio', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
    });
  });

  describe('addNotification', () => {
    it('deve adicionar uma notificação com dados corretos', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      const notificationData = {
        title: 'Teste',
        message: 'Mensagem de teste',
        type: 'success' as const,
        priority: 'high' as const,
      };
      
      act(() => {
        result.current.addNotification(notificationData);
      });
      
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject({
        title: 'Teste',
        message: 'Mensagem de teste',
        type: 'success',
        priority: 'high',
        read: false,
        createdAt: mockDate,
      });
      expect(result.current.notifications[0].id).toMatch(/^notification_/);
      expect(result.current.unreadCount).toBe(1);
    });

    it('deve usar prioridade medium como padrão', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Teste',
          message: 'Mensagem',
          type: 'info',
        });
      });
      
      expect(result.current.notifications[0].priority).toBe('medium');
    });

    it('deve ordenar notificações por prioridade e data', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Low Priority',
          message: 'Mensagem',
          type: 'info',
          priority: 'low',
        });
      });
      
      act(() => {
        result.current.addNotification({
          title: 'High Priority',
          message: 'Mensagem',
          type: 'error',
          priority: 'high',
        });
      });
      
      expect(result.current.notifications[0].title).toBe('High Priority');
      expect(result.current.notifications[1].title).toBe('Low Priority');
    });

    it('deve limitar a 50 notificações', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      // Adicionar 55 notificações
      act(() => {
        for (let i = 0; i < 55; i++) {
          result.current.addNotification({
            title: `Notificação ${i}`,
            message: 'Mensagem',
            type: 'info',
          });
        }
      });
      
      expect(result.current.notifications).toHaveLength(50);
    });
  });

  describe('removeNotification', () => {
    it('deve remover notificação específica', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Teste 1',
          message: 'Mensagem 1',
          type: 'info',
        });
        result.current.addNotification({
          title: 'Teste 2',
          message: 'Mensagem 2',
          type: 'success',
        });
      });
      
      const notificationId = result.current.notifications[0].id;
      
      act(() => {
        result.current.removeNotification(notificationId);
      });
      
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].title).toBe('Teste 1');
      expect(result.current.unreadCount).toBe(1);
    });
  });

  describe('markAsRead', () => {
    it('deve marcar notificação como lida', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Teste',
          message: 'Mensagem',
          type: 'info',
        });
      });
      
      const notificationId = result.current.notifications[0].id;
      
      act(() => {
        result.current.markAsRead(notificationId);
      });
      
      expect(result.current.notifications[0].read).toBe(true);
      expect(result.current.unreadCount).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('deve marcar todas as notificações como lidas', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Teste 1',
          message: 'Mensagem 1',
          type: 'info',
        });
        result.current.addNotification({
          title: 'Teste 2',
          message: 'Mensagem 2',
          type: 'success',
        });
      });
      
      act(() => {
        result.current.markAllAsRead();
      });
      
      expect(result.current.notifications.every(n => n.read)).toBe(true);
      expect(result.current.unreadCount).toBe(0);
    });
  });

  describe('clearAllNotifications', () => {
    it('deve limpar todas as notificações', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Teste',
          message: 'Mensagem',
          type: 'info',
        });
      });
      
      act(() => {
        result.current.clearAllNotifications();
      });
      
      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
    });
  });

  describe('getNotificationsByType', () => {
    it('deve retornar notificações filtradas por tipo', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Info',
          message: 'Mensagem info',
          type: 'info',
        });
        result.current.addNotification({
          title: 'Success',
          message: 'Mensagem success',
          type: 'success',
        });
        result.current.addNotification({
          title: 'Info 2',
          message: 'Mensagem info 2',
          type: 'info',
        });
      });
      
      const infoNotifications = result.current.getNotificationsByType('info');
      
      expect(infoNotifications).toHaveLength(2);
      expect(infoNotifications.every(n => n.type === 'info')).toBe(true);
    });
  });

  describe('getUnreadNotifications', () => {
    it('deve retornar apenas notificações não lidas', () => {
      const { result } = renderHook(() => useNotificationStore());
      
      act(() => {
        result.current.addNotification({
          title: 'Teste 1',
          message: 'Mensagem 1',
          type: 'info',
          priority: 'low',
        });
        result.current.addNotification({
          title: 'Teste 2',
          message: 'Mensagem 2',
          type: 'success',
          priority: 'high',
        });
      });
      
      // Teste 2 tem prioridade alta, então será o primeiro na lista
      const firstNotificationId = result.current.notifications[0].id;
      
      act(() => {
        result.current.markAsRead(firstNotificationId);
      });
      
      const unreadNotifications = result.current.getUnreadNotifications();
      
      expect(unreadNotifications).toHaveLength(1);
      expect(unreadNotifications[0].title).toBe('Teste 1');
    });
  });

  describe('removeExpiredNotifications', () => {
    it('deve remover notificações expiradas', () => {
      // Temporariamente restaurar Date real para este teste
      jest.restoreAllMocks();
      
      const { result } = renderHook(() => useNotificationStore());
      
      const now = new Date();
      const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 dia atrás
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 dia no futuro
      
      act(() => {
        result.current.addNotification({
          title: 'Expirada',
          message: 'Mensagem expirada',
          type: 'info',
          expiresAt: pastDate,
        });
        result.current.addNotification({
          title: 'Válida',
          message: 'Mensagem válida',
          type: 'success',
          expiresAt: futureDate,
        });
        result.current.addNotification({
          title: 'Sem expiração',
          message: 'Mensagem sem expiração',
          type: 'warning',
        });
      });
      
      // Verificar se todas as notificações foram adicionadas
      expect(result.current.notifications).toHaveLength(3);
      
      act(() => {
        result.current.removeExpiredNotifications();
      });
      
      expect(result.current.notifications).toHaveLength(2);
      expect(result.current.notifications.find(n => n.title === 'Expirada')).toBeUndefined();
      expect(result.current.notifications.find(n => n.title === 'Válida')).toBeDefined();
      expect(result.current.notifications.find(n => n.title === 'Sem expiração')).toBeDefined();
      
      // Restaurar o mock de Date
      jest.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());
    });
  });
});

describe('useNotifications hook', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useNotificationStore());
    act(() => {
      result.current.clearAllNotifications();
    });
  });

  it('deve criar notificação de sucesso', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showSuccess('Sucesso', 'Operação realizada com sucesso');
    });
    
    expect(storeResult.current.notifications).toHaveLength(1);
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Sucesso',
      message: 'Operação realizada com sucesso',
      type: 'success',
      priority: 'medium',
    });
  });

  it('deve criar notificação de erro', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showError('Erro', 'Ocorreu um erro', 'high');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Erro',
      message: 'Ocorreu um erro',
      type: 'error',
      priority: 'high',
    });
  });

  it('deve criar notificação de aviso', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showWarning('Aviso', 'Atenção necessária');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Aviso',
      message: 'Atenção necessária',
      type: 'warning',
      priority: 'medium',
    });
  });

  it('deve criar notificação de informação', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showInfo('Info', 'Informação importante');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Info',
      message: 'Informação importante',
      type: 'info',
      priority: 'low',
    });
  });

  it('deve criar notificação de agendamento', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showBookingNotification('Agendamento', 'Nova reserva confirmada');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Agendamento',
      message: 'Nova reserva confirmada',
      type: 'booking',
      priority: 'high',
    });
  });

  it('deve criar notificação de lembrete', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showReminder('Lembrete', 'Não esqueça do compromisso');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Lembrete',
      message: 'Não esqueça do compromisso',
      type: 'reminder',
      priority: 'medium',
    });
  });

  it('deve criar notificação de usuário', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showUserNotification('Usuário', 'Atualização de perfil');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Usuário',
      message: 'Atualização de perfil',
      type: 'user',
      priority: 'medium',
    });
  });

  it('deve criar notificação de sistema', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showSystemNotification('Sistema', 'Manutenção programada');
    });
    
    expect(storeResult.current.notifications[0]).toMatchObject({
      title: 'Sistema',
      message: 'Manutenção programada',
      type: 'system',
      priority: 'low',
    });
  });

  it('deve remover notificação', () => {
    const { result } = renderHook(() => useNotifications());
    const { result: storeResult } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.showSuccess('Teste', 'Mensagem de teste');
    });
    
    const notificationId = storeResult.current.notifications[0].id;
    
    act(() => {
      result.current.removeNotification(notificationId);
    });
    
    expect(storeResult.current.notifications).toHaveLength(0);
  });
});