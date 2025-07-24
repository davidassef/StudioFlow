'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Loading Spinner Component
export function LoadingSpinner({ 
  size = 'default', 
  className 
}: { 
  size?: 'sm' | 'default' | 'lg'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
}

// Loading Button Component
export function LoadingButton({
  loading,
  children,
  loadingText = 'Carregando...',
  className,
  ...props
}: {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
} & Record<string, unknown>) {
  return (
    <Button 
      disabled={loading} 
      className={cn('relative', className)}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {loading ? loadingText : children}
    </Button>
  );
}

// Progress Upload Component
export function ProgressUpload({ 
  progress, 
  fileName, 
  status = 'uploading' 
}: { 
  progress: number; 
  fileName: string; 
  status?: 'uploading' | 'success' | 'error'; 
}) {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Upload concluído';
      case 'error':
        return 'Erro no upload';
      default:
        return `Enviando... ${progress}%`;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">{getStatusText()}</p>
            {status === 'uploading' && (
              <Progress value={progress} className="mt-2" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loading Components
export function StudioCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ReservationListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Empty State Component
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-center py-12', className)}>
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

// Connection Status Component
export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleReconnect = () => {
    setIsReconnecting(true);
    // Simular tentativa de reconexão
    setTimeout(() => {
      setIsReconnecting(false);
      setIsOnline(navigator.onLine);
    }, 2000);
  };

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-3">
            <WifiOff className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Sem conexão
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Verifique sua internet
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
            >
              {isReconnecting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Success/Error Toast Component
export function StatusToast({
  type,
  title,
  description,
  onClose,
}: {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
}) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800 dark:text-green-200',
      descColor: 'text-green-700 dark:text-green-300',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800 dark:text-red-200',
      descColor: 'text-red-700 dark:text-red-300',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800 dark:text-yellow-200',
      descColor: 'text-yellow-700 dark:text-yellow-300',
    },
    info: {
      icon: AlertCircle,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800 dark:text-blue-200',
      descColor: 'text-blue-700 dark:text-blue-300',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, descColor } = config[type];

  return (
    <Card className={cn(bgColor, borderColor)}>
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <Icon className={cn('h-5 w-5 mt-0.5', iconColor)} />
          <div className="flex-1">
            <h4 className={cn('font-semibold text-sm', titleColor)}>{title}</h4>
            {description && (
              <p className={cn('text-sm mt-1', descColor)}>{description}</p>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Overlay Component
export function LoadingOverlay({
  isLoading,
  message = 'Carregando...',
  children,
}: {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <LoadingSpinner />
                <span className="text-foreground font-medium">{message}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Pulse Animation Component
export function PulseAnimation({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      {children}
    </div>
  );
}

// Fade In Animation Component
export function FadeIn({ 
  children, 
  delay = 0, 
  className 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={cn(
        'transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}