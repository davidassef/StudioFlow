'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Music,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Clock,
  Star,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X,
  LogIn,
  UserPlus
} from 'lucide-react'

// Import direto do AuthModalManager (lazy loading é feito internamente)
import AuthModalManager from '@/components/auth/AuthModalManager'

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login')

  const handleAuthAction = async (type: 'login' | 'register' = 'login') => {
    setIsAuthLoading(true)
    setAuthModalType(type)
    // Simula um pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAuthModalOpen(true)
    setIsAuthLoading(false)
  }

  const features = [
    {
      icon: Calendar,
      title: 'Agendamentos Inteligentes',
      description: 'Sistema avançado de reservas com calendário interativo e notificações automáticas.',
      color: 'text-primary'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Cadastro completo de clientes com histórico de agendamentos e preferências.',
      color: 'text-accent'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Financeiros',
      description: 'Análises detalhadas de receitas, despesas e performance do seu estúdio.',
      color: 'text-primary'
    },
    {
      icon: Settings,
      title: 'Configuração Flexível',
      description: 'Personalize o sistema de acordo com as necessidades do seu estúdio.',
      color: 'text-accent'
    }
  ]

  const benefits = [
    'Interface moderna e intuitiva',
    'Sincronização em tempo real',
    'Notificações automáticas',
    'Relatórios detalhados',
    'Suporte multiplataforma',
    'Segurança avançada'
  ]

  const stats = [
    { label: 'Estúdios Ativos', value: '150+', icon: Music },
    { label: 'Agendamentos/Mês', value: '2.5K+', icon: Calendar },
    { label: 'Clientes Satisfeitos', value: '98%', icon: Star },
    { label: 'Uptime', value: '99.9%', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header/Navigation */}
      <header className="relative z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">StudioFlow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                Recursos
              </Link>
              <Link href="#benefits" className="text-slate-300 hover:text-white transition-colors">
                Benefícios
              </Link>
              <Link href="#stats" className="text-slate-300 hover:text-white transition-colors">
                Estatísticas
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthAction('login')}
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                    disabled={isAuthLoading}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    onClick={() => handleAuthAction('register')}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isAuthLoading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col space-y-4">
                <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                  Recursos
                </Link>
                <Link href="#benefits" className="text-slate-300 hover:text-white transition-colors">
                  Benefícios
                </Link>
                <Link href="#stats" className="text-slate-300 hover:text-white transition-colors">
                  Estatísticas
                </Link>
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleAuthAction('login')}
                      className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
                      disabled={isAuthLoading}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Button>
                    <Button
                      onClick={() => handleAuthAction('register')}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      disabled={isAuthLoading}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Registrar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Sistema Completo de Gestão
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Gerencie seu
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Estúdio </span>
            com Inteligência
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa para gestão de estúdios musicais com agendamentos inteligentes, 
            controle financeiro e análises avançadas. Simplifique sua operação e maximize seus resultados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-4">
                  <Play className="h-5 w-5 mr-2" />
                  Acessar Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => handleAuthAction('register')}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-4"
                disabled={isAuthLoading}
              >
                <Play className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
            )}
            
            <Link href="#features">
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4">
                Conhecer Recursos
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {isAuthenticated && user && (
            <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700 max-w-md mx-auto">
              <p className="text-slate-300">
                Bem-vindo de volta, <span className="text-white font-semibold">{user.nome}</span>!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                  <CardContent className="pt-6">
                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Recursos Poderosos para seu Estúdio
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seu estúdio de forma eficiente e profissional.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <IconComponent className={`h-12 w-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Por que escolher o StudioFlow?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Nossa plataforma foi desenvolvida especificamente para estúdios musicais, 
                oferecendo todas as ferramentas necessárias em um só lugar.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      Ir para Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => handleAuthAction('register')}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isAuthLoading}
                  >
                    Experimentar Grátis
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-slate-300">Economia de Tempo</div>
                    <div className="text-lg font-bold text-white">70%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-sm text-slate-300">Aumento de Receita</div>
                    <div className="text-lg font-bold text-white">45%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-slate-300">Satisfação Cliente</div>
                    <div className="text-lg font-bold text-white">98%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-300">Avaliação Média</div>
                    <div className="text-lg font-bold text-white">4.9★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seu estúdio?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Junte-se a centenas de estúdios que já transformaram sua gestão com o StudioFlow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-4">
                  Acessar Minha Conta
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => handleAuthAction('register')}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-4"
                  disabled={isAuthLoading}
                >
                  Começar Teste Grátis
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAuthAction('register')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
                  disabled={isAuthLoading}
                >
                  Agendar Demonstração
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">StudioFlow</span>
            </div>
            
            <div className="text-slate-400 text-sm">
              © 2024 StudioFlow. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal com Lazy Loading */}
      {isAuthModalOpen && (
        <AuthModalManager
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialModal={authModalType}
        />
      )}
    </div>
  )
}