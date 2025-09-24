'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import {
  MusicNotes,
  MicrophoneStage,
  Guitar,
  Headphones,
  SpeakerHigh,
  PianoKeys,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart,
} from 'phosphor-react'

// Import direto do AuthModal
import AuthModal from '@/components/AuthModal'
import { StudioFlowLogo, GoldText } from '@/components/ui/GoldText'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login')
  const [currentSection, setCurrentSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll snap navigation
  const sections = ['hero', 'stats', 'features', 'testimonials', 'cta']
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const scrollPosition = containerRef.current.scrollTop
      const sectionHeight = window.innerHeight
      const newSection = Math.round(scrollPosition / sectionHeight)
      
      if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        setCurrentSection(newSection)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [currentSection, sections.length])

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
      icon: MusicNotes,
      title: 'Agendamento Inteligente',
      description: 'Sistema avançado de reservas com confirmação automática e lembretes.'
    },
    {
      icon: Guitar,
      title: 'Gestão de Estúdios',
      description: 'Controle completo de salas, equipamentos e horários de funcionamento.'
    },
    {
      icon: Headphones,
      title: 'Comunidade Musical',
      description: 'Conecte-se com outros músicos e descubra novos talentos na sua região.'
    },
    {
      icon: BarChart,
      title: 'Relatórios Detalhados',
      description: 'Análises completas de performance e faturamento do seu estúdio.'
    },
    {
      icon: SpeakerHigh,
      title: 'Segurança Total',
      description: 'Proteção de dados e transações seguras com criptografia avançada.'
    },
    {
      icon: PianoKeys,
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
    <div className="min-h-screen bg-black smooth-scroll overflow-y-auto" ref={containerRef}>
      {/* Floating Musical Instruments Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Guitar className="floating-instrument text-gold w-20 h-20 top-20 left-10 opacity-90" style={{ animationDelay: '0s' }} />
        <Headphones className="floating-instrument text-gold w-16 h-16 top-40 right-20 opacity-90" style={{ animationDelay: '2s' }} />
        <MicrophoneStage className="floating-instrument text-gold w-16 h-16 top-60 left-1/3 opacity-90" style={{ animationDelay: '4s' }} />
        <SpeakerHigh className="floating-instrument text-gold w-20 h-20 bottom-40 right-10 opacity-90" style={{ animationDelay: '1s' }} />
        <MusicNotes className="floating-instrument text-gold w-16 h-16 top-32 right-1/3 opacity-90" style={{ animationDelay: '3s' }} />
        <PianoKeys className="floating-instrument text-gold w-14 h-14 bottom-20 left-20 opacity-80" style={{ animationDelay: '5s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StudioFlowLogo className="h-10 w-10" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                Recursos
              </Link>
              <Link href="#testimonials" className="text-slate-300 hover:text-white transition-colors">
                {/* Hero Section */}
                <section className="hero-section relative flex items-center justify-center px-6">
                  <div className="container mx-auto relative z-10">
                    <header className="flex justify-between items-center py-8 px-2 md:px-8">
                      <div className="flex items-center space-x-3">
                        <StudioFlowLogo className="h-10 w-10" />
                      </div>
                      {/* Desktop Navigation ...existing code... */}
                    </header>
                    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                      <h1 className="text-6xl md:text-8xl font-extrabold gold-text mb-8 drop-shadow-gold">
                        StudioFlow: Gestão Premium para Estúdios Musicais
                      </h1>
                      <p className="text-2xl md:text-3xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Plataforma completa para agendamento, controle financeiro e automação de estúdios. Foco total na música.
                      </p>
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
                        className="w-full bg-black hover:bg-gray-900 text-gold border-2 border-gold hover:border-gold-light transition-all duration-300"
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
      <section className="hero-section relative flex items-center justify-center px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Gerencie seu <GoldText>Estúdio Musical</GoldText> com
              <br />
              <span className="gold-text text-7xl md:text-9xl">
                Inteligência Artificial
              </span>
            </h1>

            <p className="text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              A plataforma completa para donos de estúdios musicais. Automatize reservas,
              gerencie equipamentos e aumente sua receita com ferramentas avançadas de IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    className="btn-gold px-12 py-6 text-xl font-bold"
                    onClick={() => handleAuthAction('register')}
                    disabled={isAuthLoading}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Começar Agora - Grátis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-gold px-12 py-6 text-xl"
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
      <section className="hero-section relative flex items-center justify-center px-6 bg-slate-900/30">
        <div className="container mx-auto text-center relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-6xl font-bold gold-text mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="hero-section relative flex items-center justify-center px-6">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Recursos <GoldText>Avançados</GoldText> para seu Estúdio
            </h2>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Tudo que você precisa para gerenciar seu estúdio musical de forma profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <feature.icon className="w-6 h-6 text-black" />
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
      <section className="hero-section relative flex items-center justify-center px-6 bg-slate-900/30">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              O que nossos <GoldText>Clientes Dizem</GoldText>
            </h2>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Histórias reais de sucesso de quem já usa o StudioFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/60 border-slate-700 hover:bg-slate-700/60 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 italic text-center text-lg">
                    "{testimonial.content}"
                  </p>
                  <div className="text-center">
                    <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                    <div className="text-slate-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section relative flex items-center justify-center px-6">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Pronto para <GoldText>Transformar</GoldText> seu Estúdio?
            </h2>
            <p className="text-2xl text-slate-400 mb-12 max-w-3xl mx-auto">
              Junte-se a milhares de profissionais da música que já confiam no StudioFlow
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {!isAuthenticated ? (
                <Button
                  size="lg"
                  className="btn-gold px-12 py-6 text-xl font-bold"
                  onClick={() => handleAuthAction('register')}
                  disabled={isAuthLoading}
                >
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Começar Gratuitamente
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="btn-gold px-12 py-6 text-xl font-bold"
                  >
                    <BarChart3 className="w-6 h-6 mr-3" />
                    Acessar Dashboard
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
              )}

              <Button 
                variant="outline" 
                className="border-2 border-gold text-gold hover:bg-gold hover:text-slate-900 px-12 py-6 text-xl font-semibold transition-all duration-300"
              >
                <Play className="w-6 h-6 mr-3" />
                Ver Demonstração
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-slate-400">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-gold" />
                <span className="text-lg">Teste grátis por 30 dias</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-gold" />
                <span className="text-lg">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-gold" />
                <span className="text-lg">Suporte 24/7</span>
              </div>
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
                <span className="text-xl font-bold gold-text">StudioFlow</span>
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