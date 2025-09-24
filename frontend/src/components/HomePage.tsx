'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
  KeyboardMusic,
  X,
  Menu
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Aplicar estilos imediatamente ao carregar o componente
  if (typeof window !== 'undefined') {
    // Aplicar CSS global via JavaScript
    const applyGlobalNoScroll = () => {
      // Remove existing style if any
      const existingStyle = document.getElementById('global-no-scroll')
      if (existingStyle) {
        existingStyle.remove()
      }

      // Create new style element with targeted specificity
      const globalStyle = document.createElement('style')
      globalStyle.id = 'global-no-scroll'
      globalStyle.innerHTML = `
        html {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
          max-height: 100vh !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        body {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
          max-height: 100vh !important;
        }

        #__next {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          overflow: hidden !important;
          max-width: 100% !important;
          max-height: 100vh !important;
        }

        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `

      document.head.appendChild(globalStyle)

      // Force apply directly to elements
      document.documentElement.style.setProperty('overflow', 'hidden', 'important')
      document.documentElement.style.setProperty('position', 'fixed', 'important')
      document.documentElement.style.setProperty('top', '0', 'important')
      document.documentElement.style.setProperty('left', '0', 'important')
      document.documentElement.style.setProperty('width', '100%', 'important')
      document.documentElement.style.setProperty('height', '100vh', 'important')
      document.documentElement.style.setProperty('max-height', '100vh', 'important')
      document.documentElement.style.setProperty('max-width', '100%', 'important')
      document.documentElement.style.setProperty('margin', '0', 'important')
      document.documentElement.style.setProperty('padding', '0', 'important')

      document.body.style.setProperty('overflow', 'hidden', 'important')
      document.body.style.setProperty('position', 'fixed', 'important')
      document.body.style.setProperty('top', '0', 'important')
      document.body.style.setProperty('left', '0', 'important')
      document.body.style.setProperty('width', '100%', 'important')
      document.body.style.setProperty('height', '100vh', 'important')
      document.body.style.setProperty('max-height', '100vh', 'important')
      document.body.style.setProperty('max-width', '100%', 'important')
      document.body.style.setProperty('margin', '0', 'important')
      document.body.style.setProperty('padding', '0', 'important')

      // Target Next.js root
      const nextRoot = document.getElementById('__next')
      if (nextRoot) {
        nextRoot.style.setProperty('overflow', 'hidden', 'important')
        nextRoot.style.setProperty('position', 'fixed', 'important')
        nextRoot.style.setProperty('top', '0', 'important')
        nextRoot.style.setProperty('left', '0', 'important')
        nextRoot.style.setProperty('width', '100%', 'important')
        nextRoot.style.setProperty('height', '100vh', 'important')
        nextRoot.style.setProperty('max-height', '100vh', 'important')
        nextRoot.style.setProperty('max-width', '100%', 'important')
        nextRoot.style.setProperty('margin', '0', 'important')
        nextRoot.style.setProperty('padding', '0', 'important')
      }
    }

    applyGlobalNoScroll()

    // Apply multiple times to ensure it sticks
    setTimeout(applyGlobalNoScroll, 10)
    setTimeout(applyGlobalNoScroll, 50)
    setTimeout(applyGlobalNoScroll, 100)
    setTimeout(applyGlobalNoScroll, 500)
    setTimeout(applyGlobalNoScroll, 1000)
  }
  
  // Hero sections data
  const sections = [
    { id: 'hero', title: 'Bem-vindo ao StudioFlow', component: 'HeroMain' },
    { id: 'features', title: 'Funcionalidades', component: 'Features' },
    { id: 'pricing', title: 'Preços', component: 'Pricing' },
    { id: 'testimonials', title: 'Depoimentos', component: 'Testimonials' },
    { id: 'stats', title: 'Estatísticas', component: 'Stats' }
  ]

  // Navigation functions - agora baseada em scroll/touch
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
  
  // Scroll/Touch navigation
  useEffect(() => {
    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout
    
    // Previne completamente qualquer scroll
    const preventDefaultScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (isScrolling) return
      
      isScrolling = true
      const deltaY = e.deltaY
      
      if (deltaY > 0) {
        nextSection()
      } else {
        prevSection()
      }
      
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 500) // Cooldown mais rápido para melhor responsividade
    }
    
    let touchStart = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return
      
      const touchEnd = e.changedTouches[0].clientY
      const diff = touchStart - touchEnd
      
      if (Math.abs(diff) > 50) {
        isScrolling = true
        
        if (diff > 0) {
          nextSection()
        } else {
          prevSection()
        }
        
        scrollTimeout = setTimeout(() => {
          isScrolling = false
        }, 500)
      }
    }
    
    // Adiciona listeners com prevenção total de scroll
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    window.addEventListener('scroll', preventDefaultScroll, { passive: false })
    document.addEventListener('scroll', preventDefaultScroll, { passive: false })
    document.body.addEventListener('scroll', preventDefaultScroll, { passive: false })
    
    // Define scroll position como 0 sempre
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', preventDefaultScroll)
      document.removeEventListener('scroll', preventDefaultScroll)
      document.body.removeEventListener('scroll', preventDefaultScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [currentSection])

  useEffect(() => {
    // Aplicar CSS anti-scroll diretamente no DOM
    const applyNoScrollStyles = () => {
      // HTML
      document.documentElement.style.setProperty('overflow', 'hidden', 'important')
      document.documentElement.style.setProperty('height', '100vh', 'important')
      document.documentElement.style.setProperty('width', '100%', 'important')
      document.documentElement.style.setProperty('margin', '0', 'important')
      document.documentElement.style.setProperty('padding', '0', 'important')
      
      // Body
      document.body.style.setProperty('overflow', 'hidden', 'important')
      document.body.style.setProperty('height', '100vh', 'important')
      document.body.style.setProperty('width', '100%', 'important')
      document.body.style.setProperty('margin', '0', 'important')
      document.body.style.setProperty('padding', '0', 'important')
      
      // Next.js root
      const nextRoot = document.getElementById('__next')
      if (nextRoot) {
        nextRoot.style.setProperty('overflow', 'hidden', 'important')
        nextRoot.style.setProperty('height', '100vh', 'important')
        nextRoot.style.setProperty('width', '100%', 'important')
        nextRoot.style.setProperty('margin', '0', 'important')
        nextRoot.style.setProperty('padding', '0', 'important')
      }
    }

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
      
      @keyframes goldShimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .floating-instrument {
        animation: float 8s ease-in-out infinite;
        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.4));
        position: absolute;
      }
      
      .floating-instrument:nth-child(even) {
        animation: float-reverse 8s ease-in-out infinite;
      }
      
      .text-gold {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFFF00 50%, #FFD700 75%, #B8860B 100%);
        background-size: 300% 300%;
        animation: goldShimmer 3s ease-in-out infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
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
      
      .smooth-scroll {
        scroll-behavior: smooth;
      }
      
      body {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100% !important;
        max-height: 100vh !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
      }
      
      html {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100% !important;
        max-height: 100vh !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
      }

      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      
      * {
        box-sizing: border-box;
      }
      
      #__next {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100% !important;
        max-height: 100vh !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
      }
      }
      
      .main-container {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        height: 100vh !important;
        width: 100% !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      ::-webkit-scrollbar {
        display: none;
      }
      
      html, body {
        -ms-overflow-style: none;
        scrollbar-width: none;
        scroll-behavior: none;
      }
      
      .hero-section {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        height: 100vh !important;
        width: 100% !important;
        max-height: 100vh !important;
        max-width: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        background: linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%) !important;
        background-size: 400% 400% !important;
        animation: gradientShift 20s ease-in-out infinite !important;
        z-index: 10 !important;
      }
      
      .hero-section * {
        max-height: 100vh !important;
        box-sizing: border-box !important;
      }
      
      .text-center.z-10.px-6 {
        max-height: calc(100vh - 160px) !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
      }
      
      .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 40%, transparent 70%);
        pointer-events: none;
        z-index: 1;
      }
      
      .hero-section::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          linear-gradient(45deg, transparent 49%, rgba(255, 215, 0, 0.03) 50%, transparent 51%),
          linear-gradient(-45deg, transparent 49%, rgba(255, 215, 0, 0.03) 50%, transparent 51%);
        background-size: 60px 60px;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        25% { background-position: 100% 50%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
      }
    `
    document.head.appendChild(style)

    // Aplicar estilos imediatamente e depois de um pequeno delay
    applyNoScrollStyles()
    setTimeout(applyNoScrollStyles, 100)
    setTimeout(applyNoScrollStyles, 500)

    if (isAuthenticated) {
      router.push('/dashboard')
    }

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
      
      // Restaurar estilos originais ao sair
      document.documentElement.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('height')
      document.documentElement.style.removeProperty('width')
      document.documentElement.style.removeProperty('margin')
      document.documentElement.style.removeProperty('padding')
      
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('height')
      document.body.style.removeProperty('width')
      document.body.style.removeProperty('margin')
      document.body.style.removeProperty('padding')
      
      const nextRoot = document.getElementById('__next')
      if (nextRoot) {
        nextRoot.style.removeProperty('overflow')
        nextRoot.style.removeProperty('height')
        nextRoot.style.removeProperty('width')
        nextRoot.style.removeProperty('margin')
        nextRoot.style.removeProperty('padding')
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

  // Component for rendering individual sections
  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <HeroMain />
      case 1:
        return <FeaturesSection />
      case 2:
        return <PricingSection />
      case 3:
        return <TestimonialsSection />
      case 4:
        return <StatsSection />
      default:
        return <HeroMain />
    }
  }

  // Hero Main Section Component
  const HeroMain = () => (
    <motion.div
      key="hero"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hero-section"
    >
      <div className="text-center z-10 px-6">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-gold mb-8 gold-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <GoldText>StudioFlow</GoldText>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          A plataforma definitiva para gerenciar seu estúdio musical. 
          Transforme sua paixão pela música em um negócio próspero.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            onClick={handleRegister}
            className="bg-gold hover:bg-gold text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Começar Agora
            <CaretRight className="inline-block ml-2 w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={handleLogin}
            className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Fazer Login
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )

  // Features Section Component
  const FeaturesSection = () => (
    <motion.div
      key="features"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hero-section"
    >
      <div className="text-center z-10 px-6 max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-gold mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Funcionalidades Premium
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-xl border border-gold"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="text-gold mb-6 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gold mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  // Testimonials Section Component
  const TestimonialsSection = () => (
    <motion.div
      key="testimonials"
      initial={{ opacity: 0, rotateX: 15 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, rotateX: -15 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hero-section"
    >
      <div className="text-center z-10 px-6 max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-gold mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Depoimentos
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-xl border border-gold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-gold w-6 h-6" weight="fill" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              <p className="text-gold font-bold">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  // Pricing Section Component
  const PricingSection = () => (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hero-section"
    >
      <div className="text-center z-10 px-6 max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-gold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Planos & Preços
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Escolha o plano ideal para seu estúdio musical
        </motion.p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <motion.div
            className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-gold transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-center mb-6">
              <Piano className="text-gray-400 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Básico</h3>
            <div className="text-4xl font-bold text-gold mb-6">
              R$ 49
              <span className="text-lg text-gray-400">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Até 3 salas
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                50 agendamentos/mês
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Relatórios básicos
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Suporte por email
              </li>
            </ul>
            <button className="w-full bg-gray-700 hover:bg-gold text-white py-3 px-6 rounded-lg transition-colors duration-300">
              Começar Agora
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            className="bg-gradient-to-br from-gold-dark to-gold bg-opacity-20 backdrop-blur-sm p-8 rounded-xl border-2 border-gold relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gold text-black px-4 py-1 rounded-full text-sm font-bold">
                MAIS POPULAR
              </span>
            </div>
            <div className="flex justify-center mb-6">
              <Guitar className="text-gold w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
            <div className="text-4xl font-bold text-gold mb-6">
              R$ 99
              <span className="text-lg text-gray-400">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Salas ilimitadas
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Agendamentos ilimitados
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Relatórios avançados
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Sistema de pagamento
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                Suporte prioritário
              </li>
            </ul>
            <button className="w-full bg-gold hover:bg-gold-light text-black py-3 px-6 rounded-lg transition-colors duration-300 font-bold">
              Escolher Premium
            </button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-gold transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-center mb-6">
              <Mic className="text-purple-400 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <div className="text-4xl font-bold text-purple-400 mb-6">
              R$ 199
              <span className="text-lg text-gray-400">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Múltiplos estúdios
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                API personalizada
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Integrações avançadas
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Gerenciamento de equipe
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Suporte 24/7
              </li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 px-6 rounded-lg transition-colors duration-300">
              Contatar Vendas
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )

  // Stats Section Component
  const StatsSection = () => (
    <motion.div
      key="stats"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hero-section"
    >
      <div className="text-center z-10 px-6 max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-gold mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Números que Impressionam
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
            >
              <motion.h3 
                className="text-6xl md:text-8xl font-bold text-gold mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.2, type: "spring", stiffness: 100 }}
              >
                {stat.number}
              </motion.h3>
              <p className="text-xl text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleRegister}
            className="bg-gold hover:bg-gold text-black font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Junte-se a Nós Agora!
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )

  return (
    <div 
      className="homepage-container main-container bg-black" 
      ref={containerRef} 
      data-testid="main-container" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        maxHeight: '100vh',
        maxWidth: '100%'
      }}
    >
      <div className="homepage-content" style={{ height: '100vh', width: '100%', overflow: 'hidden', maxHeight: '100vh', maxWidth: '100%' }}>
        {/* Floating Musical Instruments Background */}
        <div className="fixed inset-0 pointer-events-none z-50" style={{ maxHeight: '100vh', maxWidth: '100%', overflow: 'hidden' }}>
        <Guitar className="floating-instrument text-gold w-20 h-20 top-20 left-10 opacity-90" style={{ animationDelay: '0s' }} />
        <Headphones className="floating-instrument text-gold w-16 h-16 top-40 right-20 opacity-90" style={{ animationDelay: '2s' }} />
        <Mic className="floating-instrument text-gold w-16 h-16 top-60 left-1/3 opacity-90" style={{ animationDelay: '4s' }} />
        <Speaker className="floating-instrument text-gold w-20 h-20 bottom-40 right-10 opacity-90" style={{ animationDelay: '1s' }} />
        <Piano className="floating-instrument text-gold w-16 h-16 top-32 right-1/3 opacity-90" style={{ animationDelay: '3s' }} />
        <Drum className="floating-instrument text-gold w-14 h-14 bottom-20 left-20 opacity-80" style={{ animationDelay: '5s' }} />
        <KeyboardMusic className="floating-instrument text-gold w-14 h-14 top-16 right-1/4 opacity-80" style={{ animationDelay: '6s' }} />
        <Music2 className="floating-instrument text-gold w-16 h-16 bottom-60 left-1/4 opacity-80" style={{ animationDelay: '7s' }} />
        <Music3 className="floating-instrument text-gold w-12 h-12 top-80 left-1/2 opacity-70" style={{ animationDelay: '8s' }} />
        <MicVocal className="floating-instrument text-gold w-14 h-14 bottom-32 right-1/3 opacity-75" style={{ animationDelay: '9s' }} />
        <Music4 className="floating-instrument text-gold w-18 h-18 top-96 right-16 opacity-85" style={{ animationDelay: '10s' }} />
        <Music className="floating-instrument text-gold w-16 h-16 bottom-80 left-16 opacity-80" style={{ animationDelay: '11s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-40 flex justify-between items-center p-6 bg-black bg-opacity-90 backdrop-blur-md border-b border-gold">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Music className="text-gold w-8 h-8 gold-glow" />
            <h1 className="text-3xl font-bold text-gold">StudioFlow</h1>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => goToSection(0)}
            className={`text-lg transition-all duration-300 hover:scale-105 ${
              currentSection === 0 ? 'text-gold font-bold' : 'text-white hover:text-gold'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => goToSection(1)}
            className={`text-lg transition-all duration-300 hover:scale-105 ${
              currentSection === 1 ? 'text-gold font-bold' : 'text-white hover:text-gold'
            }`}
          >
            Recursos
          </button>
          <button
            onClick={() => goToSection(2)}
            className={`text-lg transition-all duration-300 hover:scale-105 ${
              currentSection === 2 ? 'text-gold font-bold' : 'text-white hover:text-gold'
            }`}
          >
            Planos
          </button>
          <button
            onClick={() => goToSection(3)}
            className={`text-lg transition-all duration-300 hover:scale-105 ${
              currentSection === 3 ? 'text-gold font-bold' : 'text-white hover:text-gold'
            }`}
          >
            Depoimentos
          </button>
          <button
            onClick={() => goToSection(4)}
            className={`text-lg transition-all duration-300 hover:scale-105 ${
              currentSection === 4 ? 'text-gold font-bold' : 'text-white hover:text-gold'
            }`}
          >
            Estatísticas
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gold hover:text-white transition-colors duration-300 p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogin}
            className="text-gold hover:text-white transition-colors duration-300 px-4 py-2 border border-gold hover:border-white rounded-lg"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-gold hover:bg-gold-light text-black px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold/50"
          >
            Registrar
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-20 left-0 right-0 z-30 bg-black bg-opacity-95 backdrop-blur-md border-b border-gold"
          >
            <nav className="flex flex-col p-6 space-y-4">
              <button
                onClick={() => {
                  goToSection(0)
                  setIsMobileMenuOpen(false)
                }}
                className={`text-left text-lg transition-all duration-300 py-2 ${
                  currentSection === 0 ? 'text-gold font-bold' : 'text-white hover:text-gold'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => {
                  goToSection(1)
                  setIsMobileMenuOpen(false)
                }}
                className={`text-left text-lg transition-all duration-300 py-2 ${
                  currentSection === 1 ? 'text-gold font-bold' : 'text-white hover:text-gold'
                }`}
              >
                Recursos
              </button>
              <button
                onClick={() => {
                  goToSection(2)
                  setIsMobileMenuOpen(false)
                }}
                className={`text-left text-lg transition-all duration-300 py-2 ${
                  currentSection === 2 ? 'text-gold font-bold' : 'text-white hover:text-gold'
                }`}
              >
                Planos
              </button>
              <button
                onClick={() => {
                  goToSection(3)
                  setIsMobileMenuOpen(false)
                }}
                className={`text-left text-lg transition-all duration-300 py-2 ${
                  currentSection === 3 ? 'text-gold font-bold' : 'text-white hover:text-gold'
                }`}
              >
                Depoimentos
              </button>
              <button
                onClick={() => {
                  goToSection(4)
                  setIsMobileMenuOpen(false)
                }}
                className={`text-left text-lg transition-all duration-300 py-2 ${
                  currentSection === 4 ? 'text-gold font-bold' : 'text-white hover:text-gold'
                }`}
              >
                Estatísticas
              </button>
              
              <div className="pt-4 border-t border-gold border-opacity-30">
                <button
                  onClick={() => {
                    handleLogin()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-gold hover:text-white transition-colors duration-300 py-2 mb-2"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleRegister()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full bg-gold hover:bg-gold-light text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Registrar
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Slide Animation */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {renderSection()}
        </AnimatePresence>
      </main>

      {/* Navigation Indicators */}
      <div className="section-indicator">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`indicator-dot ${index === currentSection ? 'active' : ''}`}
            onClick={() => goToSection(index)}
            title={sections[index].title}
          />
        ))}
      </div>

      {/* Section Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gold"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        action={authMode}
      />
      </div> {/* Close homepage-content */}
    </div>
  )
}

export default HomePage