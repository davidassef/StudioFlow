import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'reminder' | 'user' | 'system' | 'success' | 'warning' | 'error' | 'info';
  createdAt: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: () => void;
  actionLabel?: string;
  expiresAt?: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: Notification['type']) => Notification[];
  getUnreadNotifications: () => Notification[];
  removeExpiredNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          read: false,
          priority: notification.priority || 'medium',
        };
        
        set((state) => {
          const updatedNotifications = [newNotification, ...state.notifications]
            .sort((a, b) => {
              // Ordenar por prioridade e depois por data
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              }
              return b.createdAt.getTime() - a.createdAt.getTime();
            })
            .slice(0, 50); // Manter apenas as 50 notificações mais recentes
          
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      removeNotification: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter((n) => n.id !== id);
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },
      
      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      
      getNotificationsByType: (type) => {
        const { notifications } = get();
        return notifications.filter(n => n.type === type);
      },
      
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(n => !n.read);
      },
      
      removeExpiredNotifications: () => {
        const now = new Date();
        set((state) => {
          const updatedNotifications = state.notifications.filter(n => 
            !n.expiresAt || n.expiresAt > now
          );
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
    }),
    {
      name: 'studioflow-notifications',
      version: 1,
      // Converter datas ao carregar do localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.notifications = state.notifications.map(n => ({
            ...n,
            createdAt: new Date(n.createdAt),
            expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
          }));
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      },
    }
  )
);

// Hook para facilitar o uso
export const useNotifications = () => {
  const { 
    addNotification, 
    removeNotification, 
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    removeExpiredNotifications
  } = useNotificationStore()

  const showSuccess = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    addNotification({ type: 'success', title, message, priority })
  }

  const showError = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'high') => {
    addNotification({ type: 'error', title, message, priority })
  }

  const showWarning = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    addNotification({ type: 'warning', title, message, priority })
  }

  const showInfo = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'low') => {
    addNotification({ type: 'info', title, message, priority })
  }

  const showBookingNotification = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'high') => {
    addNotification({ type: 'booking', title, message, priority })
  }

  const showReminder = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    addNotification({ type: 'reminder', title, message, priority })
  }

  const showUserNotification = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    addNotification({ type: 'user', title, message, priority })
  }

  const showSystemNotification = (title: string, message: string, priority: 'low' | 'medium' | 'high' = 'low') => {
    addNotification({ type: 'system', title, message, priority })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBookingNotification,
    showReminder,
    showUserNotification,
    showSystemNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    removeExpiredNotifications,
  }
}