'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  CreditCard,
  PiggyBank,
  Receipt,
  BarChart3
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'admin' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20avatar%20portrait&image_size=square',
};

// Mock financial data
const mockFinancialData = {
  totalReceita: 15420.50,
  totalDespesas: 8750.30,
  lucroLiquido: 6670.20,
  crescimentoMensal: 12.5,
  transacoesRecentes: [
    {
      id: '1',
      tipo: 'receita',
      descricao: 'Agendamento - Sala Premium',
      valor: 250.00,
      data: '2024-01-15',
      status: 'confirmado'
    },
    {
      id: '2',
      tipo: 'despesa',
      descricao: 'Manutenção de Equipamentos',
      valor: -180.00,
      data: '2024-01-14',
      status: 'pago'
    },
    {
      id: '3',
      tipo: 'receita',
      descricao: 'Agendamento - Sala Standard',
      valor: 150.00,
      data: '2024-01-14',
      status: 'pendente'
    },
    {
      id: '4',
      tipo: 'despesa',
      descricao: 'Conta de Energia',
      valor: -320.00,
      data: '2024-01-13',
      status: 'pago'
    }
  ]
};

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground">
              Controle completo das finanças do seu estúdio
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(mockFinancialData.totalReceita)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{mockFinancialData.crescimentoMensal}% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(mockFinancialData.totalDespesas)}
              </div>
              <p className="text-xs text-muted-foreground">
                -5.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(mockFinancialData.lucroLiquido)}
              </div>
              <p className="text-xs text-muted-foreground">
                Margem de {((mockFinancialData.lucroLiquido / mockFinancialData.totalReceita) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{mockFinancialData.crescimentoMensal}%
              </div>
              <p className="text-xs text-muted-foreground">
                Comparado ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Caixa</CardTitle>
                  <CardDescription>
                    Entrada e saída de recursos nos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de fluxo de caixa</p>
                      <p className="text-sm">(Em desenvolvimento)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Receitas</CardTitle>
                  <CardDescription>
                    Receitas por tipo de serviço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Salas Premium</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Salas Standard</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Equipamentos</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>
                  Últimas movimentações financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFinancialData.transacoesRecentes.map((transacao) => (
                    <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transacao.tipo === 'receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transacao.tipo === 'receita' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transacao.descricao}</p>
                          <p className="text-sm text-muted-foreground">{transacao.data}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.abs(transacao.valor))}
                        </p>
                        <Badge variant={transacao.status === 'confirmado' || transacao.status === 'pago' ? 'default' : 'secondary'}>
                          {transacao.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
                  <CardDescription>
                    Gere relatórios detalhados para análise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    Relatório Mensal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Análise de Performance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Relatório Anual
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Vencimentos</CardTitle>
                  <CardDescription>
                    Contas e compromissos financeiros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aluguel do Espaço</span>
                      <span className="text-sm text-red-600">Em 3 dias</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conta de Internet</span>
                      <span className="text-sm text-yellow-600">Em 7 dias</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Seguro dos Equipamentos</span>
                      <span className="text-sm text-green-600">Em 15 dias</span>
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