'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudioRegistrationForm } from '@/components/studio/StudioRegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle, Building } from 'lucide-react';
import Link from 'next/link';

interface StudioRegistrationData {
  // Informações Básicas
  name: string;
  description: string;
  studioType: string;
  
  // Contato
  phone: string;
  email: string;
  website?: string;
  
  // Endereço
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Configurações
  capacity: number;
  pricePerHour: number;
  minimumHours: number;
  
  // Horário de Funcionamento
  openTime: string;
  closeTime: string;
  
  // Equipamentos
  equipment: string[];
  
  // Imagens
  images: File[];
  profileImage: File | null;
}

export default function StudioRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleStudioRegistration = async (data: StudioRegistrationData) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simular upload de imagens
      const uploadedImages: string[] = [];
      let profileImageUrl: string | null = null;
      
      // Upload da foto de perfil
      if (data.profileImage) {
        // Simular upload da foto de perfil
        profileImageUrl = URL.createObjectURL(data.profileImage);
      }
      
      // Upload das fotos do estúdio
      for (const image of data.images) {
        // Simular upload de cada imagem
        const imageUrl = URL.createObjectURL(image);
        uploadedImages.push(imageUrl);
      }
      
      // Preparar dados para envio
      const studioData = {
        ...data,
        profileImageUrl,
        imageUrls: uploadedImages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        subscriptionStatus: 'trial', // 30 dias gratuitos
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        rating: 0,
        totalReviews: 0,
        totalBookings: 0,
        isVerified: false,
      };
      
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso (em produção, aqui seria a chamada real para a API)
      console.log('Dados do estúdio cadastrado:', studioData);
      
      // Salvar no localStorage temporariamente (em produção seria no backend)
      const existingStudios = JSON.parse(localStorage.getItem('studios') || '[]');
      const newStudio = {
        id: Date.now().toString(),
        ...studioData,
      };
      existingStudios.push(newStudio);
      localStorage.setItem('studios', JSON.stringify(existingStudios));
      
      setRegistrationStatus('success');
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao cadastrar estúdio:', error);
      setErrorMessage('Erro ao cadastrar estúdio. Tente novamente.');
      setRegistrationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Cadastro Realizado!</h2>
                <p className="text-muted-foreground mt-2">
                  Seu estúdio foi cadastrado com sucesso. Você tem 30 dias de uso gratuito!
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Período de Teste:</strong> 30 dias gratuitos<br />
                  <strong>Após o período:</strong> R$ 19,99/mês
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecionando para o dashboard em alguns segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationStatus === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Erro no Cadastro</h2>
                <p className="text-muted-foreground mt-2">
                  {errorMessage || 'Ocorreu um erro inesperado. Tente novamente.'}
                </p>
              </div>
              <Button onClick={() => setRegistrationStatus('idle')} className="w-full">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Building className="h-6 w-6" />
                  Cadastrar Estúdio
                </h1>
                <p className="text-muted-foreground">
                  Complete as informações do seu estúdio para começar a receber reservas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Informações do Período de Teste */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">🎉 Período de Teste Gratuito</CardTitle>
              <CardDescription>
                Cadastre seu estúdio agora e tenha <strong>30 dias gratuitos</strong> para testar todas as funcionalidades.
                Após o período de teste, a mensalidade é de apenas <strong>R$ 19,99</strong> para manter seu estúdio visível no app.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Formulário de Cadastro */}
          <StudioRegistrationForm
            onSubmit={handleStudioRegistration}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ao cadastrar seu estúdio, você concorda com nossos{' '}
              <Link href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}