'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientRegistrationForm } from '@/components/client/ClientRegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle, User, Music, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';

interface ClientRegistrationData {
  // Informações Pessoais
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Endereço
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Preferências
  musicGenres?: string[];
  instrumentsPlayed?: string[];
  experienceLevel?: string;
  
  // Configurações
  allowLocationAccess: boolean;
  allowNotifications: boolean;
  allowMarketingEmails: boolean;
  
  // Imagem
  profileImage: File | null;
}

export default function ClientRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleClientRegistration = async (data: ClientRegistrationData) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simular upload da foto de perfil
      let profileImageUrl: string | null = null;
      
      if (data.profileImage) {
        // Simular upload da foto de perfil
        profileImageUrl = URL.createObjectURL(data.profileImage);
      }
      
      // Preparar dados para envio
      const clientData = {
        ...data,
        profileImageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        totalBookings: 0,
        favoriteStudios: [],
        bookingHistory: [],
        preferences: {
          musicGenres: data.musicGenres || [],
          instrumentsPlayed: data.instrumentsPlayed || [],
          experienceLevel: data.experienceLevel || 'beginner',
        },
        settings: {
          allowLocationAccess: data.allowLocationAccess,
          allowNotifications: data.allowNotifications,
          allowMarketingEmails: data.allowMarketingEmails,
        },
      };
      
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso (em produção, aqui seria a chamada real para a API)
      console.log('Dados do cliente cadastrado:', clientData);
      
      // Salvar no localStorage temporariamente (em produção seria no backend)
      const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
      const newClient = {
        id: Date.now().toString(),
        ...clientData,
      };
      existingClients.push(newClient);
      localStorage.setItem('clients', JSON.stringify(existingClients));
      
      setRegistrationStatus('success');
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/estudios');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setErrorMessage('Erro ao criar conta. Tente novamente.');
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
                <h2 className="text-2xl font-bold text-foreground">Conta Criada!</h2>
                <p className="text-muted-foreground mt-2">
                  Sua conta foi criada com sucesso. Bem-vindo ao StudioFlow!
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>🎉 Uso Gratuito:</strong> Você pode usar o app gratuitamente para encontrar e reservar estúdios!
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecionando para a busca de estúdios em alguns segundos...
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
                  <User className="h-6 w-6" />
                  Criar Conta
                </h1>
                <p className="text-muted-foreground">
                  Junte-se ao StudioFlow e encontre o estúdio perfeito para suas gravações
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Benefícios para Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <Music className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Uso Gratuito</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Use o app gratuitamente para encontrar e reservar estúdios. Sem mensalidades!
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Localização GPS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Encontre estúdios próximos a você com nossa tecnologia de geolocalização.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <Heart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Salve seus estúdios favoritos e acesse rapidamente quando precisar.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Informações Importantes */}
          <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300">💡 Por que se cadastrar?</CardTitle>
              <CardDescription>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Reservas Rápidas:</strong> Faça reservas em poucos cliques</li>
                  <li><strong>Histórico:</strong> Acompanhe suas reservas e favoritos</li>
                  <li><strong>Personalização:</strong> Receba recomendações baseadas em suas preferências</li>
                  <li><strong>Notificações:</strong> Seja notificado sobre confirmações e lembretes</li>
                  <li><strong>Suporte:</strong> Acesso prioritário ao nosso suporte</li>
                </ul>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Formulário de Cadastro */}
          <ClientRegistrationForm
            onSubmit={handleClientRegistration}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              Ao criar sua conta, você concorda com nossos{' '}
              <Link href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
            <p className="text-xs">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}