'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Wifi,
  Save,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'admin' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20avatar%20portrait&image_size=square',
};

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral');
  const [isLoading, setIsLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Estados para as configurações
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações Gerais
    nomeEstudio: 'StudioFlow Music',
    endereco: 'Rua das Artes, 123',
    telefone: '(11) 99999-9999',
    email: 'contato@studioflow.com',
    
    // Notificações
    emailNotificacoes: true,
    smsNotificacoes: false,
    notificacaoAgendamento: true,
    notificacaoCancelamento: true,
    notificacaoLembrete: true,
    
    // Segurança
    autenticacaoDoisFatores: false,
    loginAutomatico: true,
    sessaoExpira: '24',
    
    // Aparência
    tema: 'dark',
    idioma: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    
    // Sistema
    backupAutomatico: true,
    logDetalhado: false,
    manutencaoAgendada: false
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSavedMessage('Configurações salvas com sucesso!');
    setIsLoading(false);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const updateConfig = (key: string, value: string | boolean) => {
    setConfiguracoes(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">
              Personalize e configure seu estúdio
            </p>
          </div>
          
          <div className="flex space-x-2">
            {savedMessage && (
              <div className="flex items-center space-x-2 text-accent">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{savedMessage}</span>
              </div>
            )}
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Sistema</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Configurações Gerais */}
          <TabsContent value="geral" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Estúdio</CardTitle>
                  <CardDescription>
                    Dados básicos do seu estúdio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Estúdio</Label>
                    <Input
                      id="nome"
                      value={configuracoes.nomeEstudio}
                      onChange={(e) => updateConfig('nomeEstudio', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={configuracoes.endereco}
                      onChange={(e) => updateConfig('endereco', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={configuracoes.telefone}
                      onChange={(e) => updateConfig('telefone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={configuracoes.email}
                      onChange={(e) => updateConfig('email', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                  <CardDescription>
                    Informações sobre o funcionamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-accent" />
                      <span className="text-sm">Conexão com API</span>
                    </div>
                    <Badge variant="default" className="bg-accent">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-accent" />
                      <span className="text-sm">Banco de Dados</span>
                    </div>
                    <Badge variant="default" className="bg-accent">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Último Backup</span>
                    </div>
                    <Badge variant="secondary">
                      2 horas atrás
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Notificações */}
          <TabsContent value="notificacoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações importantes por e-mail
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.emailNotificacoes}
                      onCheckedChange={(checked) => updateConfig('emailNotificacoes', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas urgentes por SMS
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.smsNotificacoes}
                      onCheckedChange={(checked) => updateConfig('smsNotificacoes', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novos Agendamentos</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre novos agendamentos
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.notificacaoAgendamento}
                      onCheckedChange={(checked) => updateConfig('notificacaoAgendamento', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cancelamentos</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre cancelamentos
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.notificacaoCancelamento}
                      onCheckedChange={(checked) => updateConfig('notificacaoCancelamento', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lembretes</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar lembretes de agendamentos
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.notificacaoLembrete}
                      onCheckedChange={(checked) => updateConfig('notificacaoLembrete', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Segurança */}
          <TabsContent value="seguranca" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Proteja sua conta e dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.autenticacaoDoisFatores}
                      onCheckedChange={(checked) => updateConfig('autenticacaoDoisFatores', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Manter sessão ativa por mais tempo
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.loginAutomatico}
                      onCheckedChange={(checked) => updateConfig('loginAutomatico', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessao">Expiração da Sessão (horas)</Label>
                    <Input
                      id="sessao"
                      type="number"
                      value={configuracoes.sessaoExpira}
                      onChange={(e) => updateConfig('sessaoExpira', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas de Segurança</CardTitle>
                  <CardDescription>
                    Monitoramento de atividades suspeitas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-accent">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Nenhuma atividade suspeita detectada</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Último login: Hoje às 14:30</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Dispositivos ativos: 2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Aparência */}
          <TabsContent value="aparencia" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalização da Interface</CardTitle>
                <CardDescription>
                  Customize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema</Label>
                  <select
                    id="tema"
                    className="w-full p-2 border rounded-md bg-background"
                    value={configuracoes.tema}
                    onChange={(e) => updateConfig('tema', e.target.value)}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <select
                    id="idioma"
                    className="w-full p-2 border rounded-md bg-background"
                    value={configuracoes.idioma}
                    onChange={(e) => updateConfig('idioma', e.target.value)}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <select
                    id="timezone"
                    className="w-full p-2 border rounded-md bg-background"
                    value={configuracoes.timezone}
                    onChange={(e) => updateConfig('timezone', e.target.value)}
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sistema */}
          <TabsContent value="sistema" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                  <CardDescription>
                    Configurações avançadas e manutenção
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Fazer backup dos dados diariamente
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.backupAutomatico}
                      onCheckedChange={(checked) => updateConfig('backupAutomatico', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Log Detalhado</Label>
                      <p className="text-sm text-muted-foreground">
                        Registrar atividades detalhadas do sistema
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.logDetalhado}
                      onCheckedChange={(checked) => updateConfig('logDetalhado', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Manutenção Agendada</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir manutenções automáticas
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.manutencaoAgendada}
                      onCheckedChange={(checked) => updateConfig('manutencaoAgendada', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>
                    Detalhes técnicos e versão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Versão:</span>
                      <span className="text-sm font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Última Atualização:</span>
                      <span className="text-sm font-medium">15/01/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ambiente:</span>
                      <span className="text-sm font-medium">Produção</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Uptime:</span>
                      <span className="text-sm font-medium">7 dias, 14h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}