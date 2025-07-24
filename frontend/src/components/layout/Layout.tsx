'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '../AuthModal';

interface LayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Layout({ children, user }: LayoutProps) {
  const { showAuthModal, authAction, hideAuthModal } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header user={user} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={hideAuthModal}
        action={authAction || ''}
      />
    </div>
  );
}