import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import PerfilPage from '../page'
import { useAuth } from '../../../contexts/AuthContext'

// Mocks
jest.mock('next/navigation')
jest.mock('../../../contexts/AuthContext')
jest.mock('../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, disabled, type, className }: any) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={className}
        data-testid="button"
      >
        {children}
      </button>
    )
  }
})

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUpdateProfile = jest.fn()

// Mock do fetch
global.fetch = jest.fn()

// Mock do FileReader
global.FileReader = class {
  result: string | null = null
  onload: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null
  
  readAsDataURL(file: File) {
    setTimeout(() => {
      this.result = `data:image/jpeg;base64,mock-base64-${file.name}`
      if (this.onload) {
        this.onload({ target: { result: this.result } })
      }
    }, 0)
  }
} as any

const mockClientUser = {
  id: '1',
  name: 'Maria Silva',
  email: 'maria@example.com',
  type: 'client' as const,
  avatar: 'https://example.com/avatar.jpg',
  phone: '(11) 99999-9999',
  birthDate: '1990-05-15',
  preferences: {
    musical_genres: ['rock', 'jazz'],
    experience_level: 'intermediário',
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  }
}

const mockProviderUser = {
  id: '2',
  name: 'João Santos',
  email: 'joao@example.com',
  type: 'provider' as const,
  avatar: null,
  phone: '(11) 88888-8888',
  company: 'Studio Santos',
  document: '12.345.678/0001-90'
}

describe('PerfilPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    } as any)
    
    ;(fetch as jest.Mock).mockClear()
  })

  describe('Cliente', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockClientUser,
        isAuthenticated: true,
        isProvider: () => false,
        isClient: () => true,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateProfile: mockUpdateProfile,
        token: 'mock-token',
        isLoading: false
      })
    })

    it('deve renderizar perfil de cliente', () => {
      render(<PerfilPage />)
      
      expect(screen.getByText('Meu Perfil')).toBeInTheDocument()
      expect(screen.getByText('Maria Silva')).toBeInTheDocument()
      expect(screen.getByText('maria@example.com')).toBeInTheDocument()
      
      // Abas do perfil
      expect(screen.getByText('Informações Pessoais')).toBeInTheDocument()
      expect(screen.getByText('Preferências')).toBeInTheDocument()
      expect(screen.getByText('Segurança')).toBeInTheDocument()
      expect(screen.getByText('Notificações')).toBeInTheDocument()
      
      // Campos específicos de cliente
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument()
    })

    it('deve permitir edição de informações pessoais', async () => {
      const user = userEvent.setup()
      
      mockUpdateProfile.mockResolvedValueOnce({
        success: true,
        user: { ...mockClientUser, name: 'Maria Silva Santos' }
      })
      
      render(<PerfilPage />)
      
      // Clica em editar
      await user.click(screen.getByRole('button', { name: /editar/i }))
      
      // Modifica o nome
      const nameInput = screen.getByLabelText(/nome completo/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Maria Silva Santos')
      
      // Salva as alterações
      await user.click(screen.getByRole('button', { name: /salvar/i }))
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          name: 'Maria Silva Santos',
          email: 'maria@example.com',
          phone: '(11) 99999-9999',
          birthDate: '1990-05-15'
        })
      })
    })

    it('deve permitir upload de nova foto de perfil', async () => {
      const user = userEvent.setup()
      
      mockUpdateProfile.mockResolvedValueOnce({
        success: true,
        user: { ...mockClientUser, avatar: 'new-avatar-url' }
      })
      
      render(<PerfilPage />)
      
      const file = new File(['fake image'], 'new-avatar.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText(/alterar foto/i)
      
      await user.upload(fileInput, file)
      
      await waitFor(() => {
        expect(screen.getByText('new-avatar.jpg')).toBeInTheDocument()
      })
      
      // Salva a nova foto
      await user.click(screen.getByRole('button', { name: /salvar foto/i }))
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          avatar: expect.stringContaining('data:image/jpeg;base64')
        })
      })
    })

    it('deve permitir edição de preferências musicais', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      // Navega para aba de preferências
      await user.click(screen.getByText('Preferências'))
      
      // Verifica preferências atuais
      expect(screen.getByLabelText(/rock/i)).toBeChecked()
      expect(screen.getByLabelText(/jazz/i)).toBeChecked()
      expect(screen.getByLabelText(/pop/i)).not.toBeChecked()
      
      // Adiciona nova preferência
      await user.click(screen.getByLabelText(/pop/i))
      
      // Remove preferência existente
      await user.click(screen.getByLabelText(/rock/i))
      
      // Salva alterações
      await user.click(screen.getByRole('button', { name: /salvar preferências/i }))
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          preferences: {
            ...mockClientUser.preferences,
            musical_genres: ['jazz', 'pop']
          }
        })
      })
    })

    it('deve permitir alteração de nível de experiência', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      await user.click(screen.getByText('Preferências'))
      
      // Verifica nível atual
      expect(screen.getByLabelText(/intermediário/i)).toBeChecked()
      
      // Altera para avançado
      await user.click(screen.getByLabelText(/avançado/i))
      
      await user.click(screen.getByRole('button', { name: /salvar preferências/i }))
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          preferences: {
            ...mockClientUser.preferences,
            experience_level: 'avançado'
          }
        })
      })
    })

    it('deve permitir configuração de notificações', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      await user.click(screen.getByText('Notificações'))
      
      // Verifica configurações atuais
      expect(screen.getByLabelText(/notificações por email/i)).toBeChecked()
      expect(screen.getByLabelText(/notificações push/i)).not.toBeChecked()
      expect(screen.getByLabelText(/notificações por sms/i)).toBeChecked()
      
      // Altera configurações
      await user.click(screen.getByLabelText(/notificações por email/i)) // Desabilita
      await user.click(screen.getByLabelText(/notificações push/i)) // Habilita
      
      await user.click(screen.getByRole('button', { name: /salvar notificações/i }))
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          preferences: {
            ...mockClientUser.preferences,
            notifications: {
              email: false,
              push: true,
              sms: true
            }
          }
        })
      })
    })
  })

  describe('Prestador', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockProviderUser,
        isAuthenticated: true,
        isProvider: () => true,
        isClient: () => false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateProfile: mockUpdateProfile,
        token: 'mock-token',
        isLoading: false
      })
    })

    it('deve renderizar perfil de prestador', () => {
      render(<PerfilPage />)
      
      expect(screen.getByText('João Santos')).toBeInTheDocument()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
      
      // Campos específicos de prestador
      expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument()
      
      // Abas específicas de prestador
      expect(screen.getByText('Dados da Empresa')).toBeInTheDocument()
      expect(screen.getByText('Configurações de Negócio')).toBeInTheDocument()
    })

    it('deve permitir edição de dados da empresa', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      await user.click(screen.getByText('Dados da Empresa'))
      
      // Edita nome da empresa
      const companyInput = screen.getByLabelText(/nome da empresa/i)
      await user.clear(companyInput)
      await user.type(companyInput, 'Studio Santos Premium')
      
      await user.click(screen.getByRole('button', { name: /salvar/i }))
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          company: 'Studio Santos Premium'
        })
      })
    })
  })

  describe('Funcionalidades Gerais', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockClientUser,
        isAuthenticated: true,
        isProvider: () => false,
        isClient: () => true,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateProfile: mockUpdateProfile,
        token: 'mock-token',
        isLoading: false
      })
    })

    it('deve redirecionar usuário não autenticado', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isProvider: () => false,
        isClient: () => false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateProfile: jest.fn(),
        token: null,
        isLoading: false
      })
      
      render(<PerfilPage />)
      
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('deve permitir alteração de senha', async () => {
      const user = userEvent.setup()
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Senha alterada com sucesso' })
      })
      
      render(<PerfilPage />)
      
      await user.click(screen.getByText('Segurança'))
      
      // Preenche formulário de alteração de senha
      await user.type(screen.getByLabelText(/senha atual/i), 'senhaAtual123')
      await user.type(screen.getByLabelText(/nova senha/i), 'novaSenha123')
      await user.type(screen.getByLabelText(/confirmar nova senha/i), 'novaSenha123')
      
      await user.click(screen.getByRole('button', { name: /alterar senha/i }))
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          },
          body: JSON.stringify({
            currentPassword: 'senhaAtual123',
            newPassword: 'novaSenha123'
          })
        })
      })
    })

    it('deve validar confirmação de nova senha', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      await user.click(screen.getByText('Segurança'))
      
      await user.type(screen.getByLabelText(/senha atual/i), 'senhaAtual123')
      await user.type(screen.getByLabelText(/nova senha/i), 'novaSenha123')
      await user.type(screen.getByLabelText(/confirmar nova senha/i), 'senhasDiferentes')
      
      await user.click(screen.getByRole('button', { name: /alterar senha/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument()
      })
      
      expect(fetch).not.toHaveBeenCalled()
    })

    it('deve cancelar edição e restaurar valores originais', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      // Entra em modo de edição
      await user.click(screen.getByRole('button', { name: /editar/i }))
      
      // Modifica um campo
      const nameInput = screen.getByLabelText(/nome completo/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Nome Modificado')
      
      // Cancela
      await user.click(screen.getByRole('button', { name: /cancelar/i }))
      
      // Verifica se voltou ao valor original
      expect(screen.getByDisplayValue('Maria Silva')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Nome Modificado')).not.toBeInTheDocument()
    })

    it('deve mostrar estado de loading durante salvamento', async () => {
      const user = userEvent.setup()
      
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      mockUpdateProfile.mockReturnValue(promise)
      
      render(<PerfilPage />)
      
      await user.click(screen.getByRole('button', { name: /editar/i }))
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Novo Nome')
      
      // Inicia salvamento
      await user.click(screen.getByRole('button', { name: /salvar/i }))
      
      // Verifica estado de loading
      expect(screen.getByText(/salvando.../i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /salvando.../i })).toBeDisabled()
      
      // Resolve a promise
      resolvePromise!({
        success: true,
        user: { ...mockClientUser, name: 'Novo Nome' }
      })
      
      await waitFor(() => {
        expect(screen.queryByText(/salvando.../i)).not.toBeInTheDocument()
      })
    })

    it('deve lidar com erro de atualização', async () => {
      const user = userEvent.setup()
      
      mockUpdateProfile.mockRejectedValueOnce(new Error('Erro ao atualizar perfil'))
      
      render(<PerfilPage />)
      
      await user.click(screen.getByRole('button', { name: /editar/i }))
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Novo Nome')
      
      await user.click(screen.getByRole('button', { name: /salvar/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/erro ao atualizar perfil/i)).toBeInTheDocument()
      })
    })

    it('deve validar formato de telefone', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      await user.click(screen.getByRole('button', { name: /editar/i }))
      
      const phoneInput = screen.getByLabelText(/telefone/i)
      await user.clear(phoneInput)
      await user.type(phoneInput, '123')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/telefone deve ter o formato \(00\) 00000-0000/i)).toBeInTheDocument()
      })
    })

    it('deve formatar telefone automaticamente', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      await user.click(screen.getByRole('button', { name: /editar/i }))
      
      const phoneInput = screen.getByLabelText(/telefone/i)
      await user.clear(phoneInput)
      await user.type(phoneInput, '11987654321')
      
      expect(phoneInput).toHaveValue('(11) 98765-4321')
    })

    it('deve validar tipo de arquivo para avatar', async () => {
      const user = userEvent.setup()
      
      render(<PerfilPage />)
      
      const file = new File(['fake file'], 'document.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/alterar foto/i)
      
      await user.upload(fileInput, file)
      
      await waitFor(() => {
        expect(screen.getByText(/apenas imagens são permitidas/i)).toBeInTheDocument()
      })
    })

    it('deve mostrar histórico de atividades', () => {
      render(<PerfilPage />)
      
      expect(screen.getByText('Atividade Recente')).toBeInTheDocument()
      expect(screen.getByText(/última reserva/i)).toBeInTheDocument()
      expect(screen.getByText(/perfil atualizado/i)).toBeInTheDocument()
    })

    it('deve permitir exclusão de conta', async () => {
      const user = userEvent.setup()
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Conta excluída com sucesso' })
      })
      
      render(<PerfilPage />)
      
      await user.click(screen.getByText('Segurança'))
      
      // Clica em excluir conta
      await user.click(screen.getByRole('button', { name: /excluir conta/i }))
      
      // Confirma exclusão
      await user.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      })
    })

    it('deve ter layout responsivo', () => {
      render(<PerfilPage />)
      
      const container = screen.getByTestId('profile-container')
      expect(container).toHaveClass('responsive-layout')
    })
  })
})