'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/shared-mock';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from stored tokens
    initializeAuth();
  }, [initializeAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}