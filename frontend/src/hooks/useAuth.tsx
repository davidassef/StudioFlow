import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/**
 * Hook personalizado para acessar o contexto de autenticação
 * 
 * @returns {AuthContextType} Objeto com dados e funções de autenticação
 * @throws {Error} Se usado fora do AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}

export default useAuth