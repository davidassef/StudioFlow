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

// Import direto do AuthModal
import AuthModal from '@/components/AuthModal'
import { StudioFlowLogo, GoldText } from '@/components/ui/GoldText'

export default function HomePage() {
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
      title: 'Agendamento Inteligente',
      description: 'Sistema avançado de reservas com confirmação automática e lembretes.'
    },
    {
      icon: Music,
      title: 'Gestão de Estúdios',
      description: 'Controle completo de salas, equipamentos e horários de funcionamento.'
    },
    {
      icon: Users,
      title: 'Comunidade Musical',
      description: 'Conecte-se com outros músicos e descubra novos talentos na sua região.'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Detalhados',
      description: 'Análises completas de performance e faturamento do seu estúdio.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Proteção de dados e transações seguras com criptografia avançada.'
    },
    {
      icon: Zap,
      title: 'Performance Otimizada',
      description: 'Interface rápida e responsiva para uma experiência excepcional.'
    }
  ]

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Produtor Musical',
      content: 'O StudioFlow revolucionou a forma como gerencio meu estúdio. A praticidade e eficiência são impressionantes.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Cantora Profissional',
      content: 'Encontrar e reservar estúdios nunca foi tão fácil. A plataforma é intuitiva e confiável.',
      rating: 5
    },
    {
      name: 'Roberto Santos',
      role: 'Dono de Estúdio',
      content: 'Meus clientes adoram a facilidade de agendamento. Meu faturamento aumentou significativamente.',
      rating: 5
    }
  ]

  const stats = [
    { number: '500+', label: 'Estúdios Cadastrados' },
    { number: '10k+', label: 'Reservas Realizadas' },
    { number: '50k+', label: 'Usuários Ativos' },
    { number: '98%', label: 'Satisfação dos Clientes' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StudioFlowLogo className="h-8 w-8" />
              <span className="text-xl font-bold text-white">StudioFlow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                Recursos
              </Link>
              <Link href="#testimonials" className="text-slate-300 hover:text-white transition-colors">
                Depoimentos
              </Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                Preços
              </Link>
              <Link href="#contact" className="text-slate-300 hover:text-white transition-colors">
                Contato
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-slate-300">Olá, {user?.email?.split('@')[0]}</span>
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                    onClick={() => handleAuthAction('login')}
                    disabled={isAuthLoading}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleAuthAction('register')}
                    disabled={isAuthLoading}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50 pt-4">
              <nav className="flex flex-col space-y-4">
                <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                  Recursos
                </Link>
                <Link href="#testimonials" className="text-slate-300 hover:text-white transition-colors">
                  Depoimentos
                </Link>
                <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                  Preços
                </Link>
                <Link href="#contact" className="text-slate-300 hover:text-white transition-colors">
                  Contato
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-700/50">
                  {isAuthenticated ? (
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full text-slate-300 hover:text-white hover:bg-slate-700 justify-start"
                        onClick={() => handleAuthAction('login')}
                        disabled={isAuthLoading}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Entrar
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => handleAuthAction('register')}
                        disabled={isAuthLoading}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Cadastrar
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
              🚀 Nova Versão Disponível
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Gerencie seu <GoldText>Estúdio Musical</GoldText> com
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Inteligência Artificial
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              A plataforma completa para donos de estúdios musicais. Automatize reservas,
              gerencie equipamentos e aumente sua receita com ferramentas avançadas de IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                    onClick={() => handleAuthAction('register')}
                    disabled={isAuthLoading}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Começar Agora - Grátis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-4 text-lg"
                    onClick={() => handleAuthAction('login')}
                    disabled={isAuthLoading}
                  >
                    Já tenho conta
                  </Button>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ir para Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Recursos <GoldText>Avançados</GoldText>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seu estúdio musical de forma profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              O que nossos <GoldText>Clientes Dizem</GoldText>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Histórias reais de sucesso de quem já usa o StudioFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para <GoldText>Transformar</GoldText> seu Estúdio?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Junte-se a milhares de profissionais da música que já confiam no StudioFlow
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                  onClick={() => handleAuthAction('register')}
                  disabled={isAuthLoading}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Começar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Acessar Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <StudioFlowLogo className="h-8 w-8" />
                <span className="text-xl font-bold text-white">StudioFlow</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                A plataforma completa para gestão de estúdios musicais.
                Automatize seu negócio e foque no que realmente importa: fazer música.
              </p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  React
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Next.js
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  TypeScript
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Recursos</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="#testimonials" className="hover:text-white transition-colors">Depoimentos</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#contact" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentação</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 StudioFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        action={authModalType}
      />
    </div>
  )
}