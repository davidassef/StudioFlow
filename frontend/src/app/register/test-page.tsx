'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input } from '@/components/ui'
import { TestCard, TestCardHeader, TestCardTitle, TestCardContent } from '@/components/ui/test-card'

export default function TestRegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    password_confirm: '',
    user_type: 'CLIENTE' as 'ADMIN' | 'CLIENTE'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      await register(formData)
      router.push('/dashboard')
    } catch (err: unknown) {
      console.error('Erro no registro:', err)
      const errorObj = err as { response?: { data?: Record<string, string[]> } }
      if (errorObj.response?.data) {
        setErrors(errorObj.response.data)
      } else {
        setErrors({ non_field_errors: ['Erro ao criar conta. Tente novamente.'] })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string) => {
    return errors[fieldName]?.[0] || ''
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <TestCard>
          <TestCardHeader>
            <TestCardTitle>
              Criar Conta - Teste
            </TestCardTitle>
            <p className="text-gray-600 mt-2">
              Cadastre-se para começar a usar o StudioFlow
            </p>
          </TestCardHeader>
          
          <TestCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.non_field_errors && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {errors.non_field_errors[0]}
                </div>
              )}
              
              <div>
                <Input
                  label="Nome completo"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  disabled={isLoading}
                  error={getFieldError('nome')}
                />
              </div>
              
              <div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                  error={getFieldError('email')}
                />
              </div>
              
              <div>
                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  error={getFieldError('password')}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </TestCardContent>
        </TestCard>
      </div>
    </div>
  )
}