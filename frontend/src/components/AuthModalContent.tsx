'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { StudioFlowLogo } from '@/components/ui/GoldText'

interface AuthModalContentProps {
  isOpen: boolean
  onClose: () => void
  action: string
}

export default function AuthModalContent({ isOpen, onClose, action }: AuthModalContentProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    telefone: '',
    user_type: 'CLIENTE' as 'CLIENTE' | 'PRESTADOR',
    password_confirm: ''
  })

  const { login, register, loginWithGoogle, isLoading, error, clearError } = useAuthStore()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        nome: '',
        telefone: '',
        user_type: 'CLIENTE',
        password_confirm: ''
      })
      clearError()
    }
  }, [isOpen, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        // Fechar modal após login bem-sucedido
        setTimeout(() => {
          onClose()
        }, 500)
      } else {
        if (formData.password !== formData.password_confirm) {
          throw new Error('As senhas não coincidem')
        }
        await register(formData.email, formData.password, {
          nome: formData.nome,
          telefone: formData.telefone,
          user_type: formData.user_type
        })
        // Fechar modal após registro bem-sucedido
        setTimeout(() => {
          onClose()
        }, 500)
      }
    } catch (err: any) {
      // Error is handled by the store
      console.error('Authentication error:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoogleLogin = async () => {
    try {
      clearError()
      await loginWithGoogle()
      // O OAuth vai redirecionar automaticamente, então não fechamos o modal aqui
    } catch (err: any) {
      // Error is handled by the store
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-black/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-amber-400/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-amber-400/20">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-amber-400 hover:text-amber-300 transition-colors p-1 rounded-full hover:bg-amber-400/10"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <StudioFlowLogo className="text-2xl mb-2" />
              <p className="text-amber-200 text-sm">
                {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-amber-200 text-sm mb-6 text-center">
              {isLogin 
                ? 'Entre para acessar todos os recursos do StudioFlow'
                : 'Crie sua conta e comece a usar o StudioFlow'
              }
            </p>

            {/* Google Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 mb-4 border border-gray-200 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-400/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-amber-200">ou</span>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-amber-100 placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-amber-200 mb-2">
                        Nome
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 w-5 h-5" />
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-amber-100 placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-200 mb-2">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 w-5 h-5" />
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-amber-100 placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-200 mb-2">
                        Tipo de Usuário
                      </label>
                      <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                      >
                        <option value="CLIENTE">Cliente</option>
                        <option value="PRESTADOR">Prestador de Serviço</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-amber-100 placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 hover:text-amber-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-amber-200 mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-amber-100 placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                        placeholder="Confirme sua senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400/80 hover:text-amber-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:from-amber-600 disabled:to-yellow-700 text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  isLogin ? 'Entrar' : 'Criar Conta'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-300 hover:text-amber-200 text-sm transition-colors"
              >
                {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}