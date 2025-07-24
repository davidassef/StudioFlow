'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { AdvancedDashboard } from '@/components/dashboard/AdvancedDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingOverlay, DashboardSkeleton, ConnectionStatus } from '@/components/ui/LoadingStates';
import { Button } from '@/components/ui/button';
import { BarChart3, Activity, TrendingUp } from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'admin' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20avatar%20portrait&image_size=square',
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Layout user={mockUser}>
        <DashboardSkeleton />
      </Layout>
    );
  }

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta, {mockUser.name}!
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Análise Avançada</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <LoadingOverlay isLoading={false}>
              <DashboardOverview />
            </LoadingOverlay>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6">
            <LoadingOverlay isLoading={false}>
              <AdvancedDashboard />
            </LoadingOverlay>
          </TabsContent>
        </Tabs>
        
        <ConnectionStatus />
      </div>
    </Layout>
  );
}