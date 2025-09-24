'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence }       
      .smooth-scroll {
        scroll-behavior: smooth;
      }
      
      .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      
      .section-indicator {
        position: fixed;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .indicator-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #FFD700;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .indicator-dot.active {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      }
      
      .nav-arrow {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        background: rgba(255, 215, 0, 0.1);
        border: 2px solid #FFD700;
        color: #FFD700;
        padding: 1rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      
      .nav-arrow:hover {
        background: rgba(255, 215, 0, 0.2);
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
      }
      
      .nav-arrow.up {
        top: 2rem;
      }
      
      .nav-arrow.down {
        bottom: 2rem;
      }` 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAuthStore } from '../stores/authStore'
import { GoldText } from './ui/GoldText'
import AuthModal from './AuthModal'
import {
  Guitar,
  Piano,
  Drum,
  Mic,
  Headphones,
  Speaker,
  Music,
  Music2,
  Music3,
  Music4,
  MicVocal,
  KeyboardMusic
} from 'lucide-react'
import {
  CaretRight,
  Check,
  Star,
  Users,
  ChartLineUp
} from 'phosphor-react'

const HomePage = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [currentSection, setCurrentSection] = useState(0)
  
  // Hero sections data
  const sections = [
    { id: 'hero', title: 'Bem-vindo ao StudioFlow', component: 'HeroMain' },
    { id: 'features', title: 'Funcionalidades', component: 'Features' },
    { id: 'testimonials', title: 'Depoimentos', component: 'Testimonials' },
    { id: 'stats', title: 'Estatísticas', component: 'Stats' }
  ]

  // Navigation functions
  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }
  
  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }
  
  const goToSection = (index: number) => {
    setCurrentSection(index)
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        nextSection()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        prevSection()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSection])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(-2deg); }
        50% { transform: translateY(-40px) rotate(0deg); }
        75% { transform: translateY(-20px) rotate(2deg); }
      }
      
      @keyframes float-reverse {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(20px) rotate(2deg); }
        50% { transform: translateY(40px) rotate(0deg); }
        75% { transform: translateY(20px) rotate(-2deg); }
      }
      
      @keyframes glow-pulse {
        0%, 100% { text-shadow: 0 0 20px #fbbf24, 0 0 40px #fbbf24, 0 0 60px #fbbf24; }
        50% { text-shadow: 0 0 30px #fbbf24, 0 0 50px #fbbf24, 0 0 70px #fbbf24; }
      }
      
      .floating-instrument {
        animation: float 8s ease-in-out infinite;
        filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4));
        position: absolute;
      }
      
      .floating-instrument:nth-child(even) {
        animation: float-reverse 8s ease-in-out infinite;
      }
      
      .text-glow {
        animation: glow-pulse 3s ease-in-out infinite;
      }
      
      .bg-black {
        background-color: #000000;
      }
      
      .text-gold {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFFF00 50%, #FFD700 75%, #B8860B 100%);
        background-size: 300% 300%;
        animation: goldShimmer 3s ease-in-out infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      @keyframes goldShimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .bg-gold {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFFF00 50%, #FFD700 75%, #B8860B 100%);
        background-size: 300% 300%;
        animation: goldShimmer 3s ease-in-out infinite;
      }
      
      .border-gold {
        border-color: #FFD700;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
      }
      
      .gold-glow {
        filter: drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FFA500);
      }
      
      .bg-gold {
        background-color: #fbbf24;
      }
      
      .hover\\:bg-gold:hover {
        background-color: #fbbf24;
      }
      
      .smooth-scroll {
        scroll-behavior: smooth;
      }
    `
    document.head.appendChild(style)

    if (isAuthenticated) {
      router.push('/dashboard')
    }

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [isAuthenticated, router])

  const handleLogin = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  const handleRegister = () => {
    setAuthMode('register')
    setIsAuthModalOpen(true)
  }

  const features = [
    { icon: <Music className="w-8 h-8" />, title: 'Gestão de Salas', description: 'Organize suas salas de ensaio com facilidade' },
    { icon: <Users className="w-8 h-8" />, title: 'Agendamento Inteligente', description: 'Sistema de reservas automatizado e eficiente' },
    { icon: <ChartLineUp className="w-8 h-8" />, title: 'Relatórios Completos', description: 'Análise detalhada do seu negócio musical' }
  ]

  const testimonials = [
    { name: 'João Silva', rating: 5, text: 'StudioFlow revolucionou a gestão do meu estúdio!' },
    { name: 'Maria Santos', rating: 5, text: 'Interface intuitiva e funcionalidades incríveis.' },
    { name: 'Pedro Costa', rating: 5, text: 'Recomendo para todos os proprietários de estúdio.' }
  ]

  const stats = [
    { number: '10k+', label: 'Reservas Realizadas' },
    { number: '50k+', label: 'Usuários Ativos' },
    { number: '98%', label: 'Satisfação dos Clientes' }
  ]

  return (
    <div className="min-h-screen bg-black smooth-scroll overflow-y-auto" ref={containerRef}>
      {/* Floating Musical Instruments Background - Fixed syntax */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Guitar className="floating-instrument text-gold w-20 h-20 top-20 left-10 opacity-90" style={{ animationDelay: '0s' }} />
        <Headphones className="floating-instrument text-gold w-16 h-16 top-40 right-20 opacity-90" style={{ animationDelay: '2s' }} />
        <Mic className="floating-instrument text-gold w-16 h-16 top-60 left-1/3 opacity-90" style={{ animationDelay: '4s' }} />
        <Speaker className="floating-instrument text-gold w-20 h-20 bottom-40 right-10 opacity-90" style={{ animationDelay: '1s' }} />
        <Piano className="floating-instrument text-gold w-16 h-16 top-32 right-1/3 opacity-90" style={{ animationDelay: '3s' }} />
        <Drum className="floating-instrument text-gold w-14 h-14 bottom-20 left-20 opacity-80" style={{ animationDelay: '5s' }} />
        <MicVocal className="floating-instrument text-gold w-14 h-14 top-16 right-1/4 opacity-80" style={{ animationDelay: '6s' }} />
        <Music2 className="floating-instrument text-gold w-16 h-16 bottom-60 left-1/4 opacity-80" style={{ animationDelay: '7s' }} />
        <Music3 className="floating-instrument text-gold w-12 h-12 top-80 left-1/2 opacity-70" style={{ animationDelay: '8s' }} />
        <KeyboardMusic className="floating-instrument text-gold w-14 h-14 bottom-32 right-1/3 opacity-75" style={{ animationDelay: '9s' }} />
        <Music4 className="floating-instrument text-gold w-18 h-18 top-96 right-16 opacity-85" style={{ animationDelay: '10s' }} />
        <Guitar className="floating-instrument text-gold w-16 h-16 bottom-80 left-16 opacity-80" style={{ animationDelay: '11s' }} />
      </div>

      <div>
        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Music className="text-gold w-8 h-8" />
              <h1 className="text-3xl font-bold text-gold">StudioFlow</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#recursos" className="text-white hover:text-gold transition-colors">Recursos</a>
            <a href="#depoimentos" className="text-white hover:text-gold transition-colors">Depoimentos</a>
            <a href="#precos" className="text-white hover:text-gold transition-colors">Preços</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogin}
              className="text-white hover:text-gold transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={handleRegister}
              className="bg-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 text-center py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <GoldText className="text-glow">Foco total na música</GoldText>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A plataforma completa para gerenciar seu estúdio musical com eficiência e praticidade
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleRegister}
                className="bg-gold text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center"
              >
                <span>Começar Agora</span>
                <CaretRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={handleLogin}
                className="border-2 border-gold text-gold px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold hover:text-black transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="recursos" className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <GoldText>Recursos Principais</GoldText>
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Tudo que você precisa para administrar seu estúdio de forma profissional
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-8 rounded-2xl bg-gray-900 bg-opacity-60 backdrop-blur-sm border border-gray-800 hover:border-gold transition-all duration-300">
                  <div className="text-gold mb-4 flex justify-center">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 py-24 px-6 bg-gray-900 bg-opacity-40">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-6">
                  <div className="text-4xl md:text-6xl font-bold text-gold mb-2">{stat.number}</div>
                  <div className="text-lg text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <GoldText>Depoimentos</GoldText>
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Veja o que nossos clientes dizem sobre o StudioFlow
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-8 rounded-2xl bg-gray-900 bg-opacity-60 backdrop-blur-sm border border-gray-800">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="text-gold font-medium">— {testimonial.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <GoldText>Pronto para começar?</GoldText>
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de estúdios que já confiam no StudioFlow
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleRegister}
                className="bg-gold text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center"
              >
                <span>Criar Conta Gratuita</span>
                <CaretRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-12 px-6 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-t border-gray-800">
          <div className="max-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Music className="text-gold w-6 h-6" />
              <span className="text-xl font-bold text-gold">StudioFlow</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 StudioFlow. Todos os direitos reservados.
            </p>
          </div>
        </footer>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          action={authMode}
        />
      </div>
    </div>
  )
}

export default HomePage