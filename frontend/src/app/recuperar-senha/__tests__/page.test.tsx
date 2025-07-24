import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import RecuperarSenhaPage from '../page'

// Mocks
jest.mock('next/navigation')
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

// Mock do fetch
global.fetch = jest.fn()

describe('RecuperarSenhaPage', () => {
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

  it('deve renderizar o formulário de recuperação de senha', () => {
    render(<RecuperarSenhaPage />)
    
    expect(screen.getByText('Recuperar Senha')).toBeInTheDocument()
    expect(screen.getByText('Digite seu email para receber as instruções de recuperação')).toBeInTheDocument()
    
    // Campo de email
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    
    // Botões
    expect(screen.getByRole('button', { name: /enviar instruções/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar ao login/i })).toBeInTheDocument()
    
    // Informações adicionais
    expect(screen.getByText(/lembrou da senha\?/i)).toBeInTheDocument()
  })

  it('deve enviar email de recuperação com sucesso', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: 'Email de recuperação enviado com sucesso'
      })
    })
    
    render(<RecuperarSenhaPage />)
    
    // Preenche o email
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    
    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'joao@example.com' })
      })
    })
    
    await waitFor(() => {
      expect(screen.getByText(/email de recuperação enviado com sucesso/i)).toBeInTheDocument()
    })
  })

  it('deve validar campo de email obrigatório', async () => {
    const user = userEvent.setup()
    
    render(<RecuperarSenhaPage />)
    
    // Tenta submeter sem preencher email
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
    })
    
    expect(fetch).not.toHaveBeenCalled()
  })

  it('deve validar formato do email', async () => {
    const user = userEvent.setup()
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'email-invalido')
    await user.tab() // Sai do campo para disparar validação
    
    await waitFor(() => {
      expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument()
    })
  })

  it('deve lidar com erro quando email não existe', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ 
        message: 'Email não encontrado em nossa base de dados'
      })
    })
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'inexistente@example.com')
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email não encontrado em nossa base de dados/i)).toBeInTheDocument()
    })
  })

  it('deve lidar com erro de servidor', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Erro de conexão'))
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/erro ao enviar email de recuperação/i)).toBeInTheDocument()
    })
  })

  it('deve mostrar estado de loading durante envio', async () => {
    const user = userEvent.setup()
    
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(fetch as jest.Mock).mockReturnValue(promise)
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    
    // Inicia envio
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    // Verifica estado de loading
    expect(screen.getByText(/enviando.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviando.../i })).toBeDisabled()
    
    // Resolve a promise
    resolvePromise!({
      ok: true,
      json: async () => ({ message: 'Email enviado' })
    })
    
    await waitFor(() => {
      expect(screen.queryByText(/enviando.../i)).not.toBeInTheDocument()
    })
  })

  it('deve voltar para página de login', async () => {
    const user = userEvent.setup()
    
    render(<RecuperarSenhaPage />)
    
    await user.click(screen.getByRole('button', { name: /voltar ao login/i }))
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('deve navegar para login através do link', async () => {
    const user = userEvent.setup()
    
    render(<RecuperarSenhaPage />)
    
    await user.click(screen.getByText(/lembrou da senha\? faça login/i))
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('deve mostrar mensagem de sucesso após envio', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        message: 'Email enviado com sucesso'
      })
    })
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email enviado com sucesso/i)).toBeInTheDocument()
      expect(screen.getByText(/verifique sua caixa de entrada/i)).toBeInTheDocument()
      expect(screen.getByText(/não esqueça de verificar a pasta de spam/i)).toBeInTheDocument()
    })
  })

  it('deve permitir reenvio após sucesso', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ 
        message: 'Email enviado com sucesso'
      })
    })
    
    render(<RecuperarSenhaPage />)
    
    // Primeiro envio
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email enviado com sucesso/i)).toBeInTheDocument()
    })
    
    // Deve mostrar opção de reenvio
    expect(screen.getByRole('button', { name: /reenviar email/i })).toBeInTheDocument()
    
    // Reenvio
    await user.click(screen.getByRole('button', { name: /reenviar email/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  it('deve limpar erros ao digitar no campo de email', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ 
        message: 'Email não encontrado'
      })
    })
    
    render(<RecuperarSenhaPage />)
    
    // Gera um erro
    await user.type(screen.getByLabelText(/email/i), 'inexistente@example.com')
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email não encontrado/i)).toBeInTheDocument()
    })
    
    // Digita no campo - deve limpar o erro
    await user.clear(screen.getByLabelText(/email/i))
    await user.type(screen.getByLabelText(/email/i), 'novo@example.com')
    
    expect(screen.queryByText(/email não encontrado/i)).not.toBeInTheDocument()
  })

  it('deve focar no campo de email ao carregar', () => {
    render(<RecuperarSenhaPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveFocus()
  })

  it('deve permitir submissão com Enter', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Email enviado' })
    })
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    
    // Pressiona Enter
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
  })

  it('deve mostrar informações sobre o processo de recuperação', () => {
    render(<RecuperarSenhaPage />)
    
    expect(screen.getByText(/como funciona:/i)).toBeInTheDocument()
    expect(screen.getByText(/1\. digite seu email cadastrado/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. verifique sua caixa de entrada/i)).toBeInTheDocument()
    expect(screen.getByText(/3\. clique no link recebido/i)).toBeInTheDocument()
    expect(screen.getByText(/4\. crie uma nova senha/i)).toBeInTheDocument()
  })

  it('deve mostrar tempo estimado para recebimento do email', () => {
    render(<RecuperarSenhaPage />)
    
    expect(screen.getByText(/o email chegará em até 5 minutos/i)).toBeInTheDocument()
  })

  it('deve ter layout responsivo', () => {
    render(<RecuperarSenhaPage />)
    
    const container = screen.getByTestId('recovery-container')
    expect(container).toHaveClass('responsive-layout')
  })

  it('deve mostrar link para suporte', () => {
    render(<RecuperarSenhaPage />)
    
    expect(screen.getByText(/problemas\? entre em contato/i)).toBeInTheDocument()
    expect(screen.getByText(/suporte@studioflow\.com/i)).toBeInTheDocument()
  })

  it('deve implementar rate limiting visual', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Email enviado' })
    })
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    
    // Primeiro envio
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email enviado com sucesso/i)).toBeInTheDocument()
    })
    
    // Deve mostrar contador para próximo envio
    expect(screen.getByText(/próximo envio em/i)).toBeInTheDocument()
  })

  it('deve validar diferentes formatos de email', async () => {
    const user = userEvent.setup()
    
    render(<RecuperarSenhaPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    
    // Testa emails inválidos
    const invalidEmails = [
      'email',
      'email@',
      '@domain.com',
      'email@domain',
      'email.domain.com'
    ]
    
    for (const email of invalidEmails) {
      await user.clear(emailInput)
      await user.type(emailInput, email)
      await user.tab()
      
      expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument()
    }
    
    // Testa email válido
    await user.clear(emailInput)
    await user.type(emailInput, 'valid@example.com')
    await user.tab()
    
    expect(screen.queryByText(/email deve ter um formato válido/i)).not.toBeInTheDocument()
  })

  it('deve mostrar diferentes mensagens baseadas no status da resposta', async () => {
    const user = userEvent.setup()
    
    // Teste para rate limit
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ 
        message: 'Muitas tentativas. Tente novamente em 15 minutos'
      })
    })
    
    render(<RecuperarSenhaPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.click(screen.getByRole('button', { name: /enviar instruções/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/muitas tentativas/i)).toBeInTheDocument()
    })
  })
})