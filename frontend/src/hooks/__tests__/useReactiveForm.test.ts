import { renderHook, act } from '@testing-library/react';
import { useReactiveForm, commonSchemas } from '../useReactiveForm';
import * as z from 'zod';
import { useNotifications } from '@/stores/notificationStore';

// Mock do useNotifications
jest.mock('@/stores/notificationStore');
const mockUseNotifications = useNotifications as jest.MockedFunction<typeof useNotifications>;

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

mockUseNotifications.mockReturnValue({
  showSuccess: mockShowSuccess,
  showError: mockShowError,
  showWarning: jest.fn(),
  showInfo: jest.fn(),
  showBookingNotification: jest.fn(),
  showReminder: jest.fn(),
  showUserNotification: jest.fn(),
  showSystemNotification: jest.fn(),
  removeNotification: jest.fn(),
});

// Schema de teste simples
const testSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

describe('useReactiveForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('deve inicializar com estado padrão', () => {
      const mockOnSubmit = jest.fn();
      
      const { result } = renderHook(() =>
        useReactiveForm({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      );
      
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors).toEqual({});
    });

    it('deve aceitar valores padrão', () => {
      const mockOnSubmit = jest.fn();
      const defaultValues = {
        name: 'João',
        email: 'joao@example.com',
      };
      
      const { result } = renderHook(() =>
        useReactiveForm({
          schema: testSchema,
          onSubmit: mockOnSubmit,
          defaultValues,
        })
      );
      
      expect(result.current.getValues()).toEqual(defaultValues);
    });
  });

  describe('Validação', () => {
    it('deve validar campo corretamente', () => {
      const mockOnSubmit = jest.fn();
      
      const { result } = renderHook(() =>
        useReactiveForm({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      );
      
      // Campo válido
      const isValid = result.current.validateField('name', 'João Silva');
      expect(isValid).toBe(true);
      
      // Campo inválido
      const isInvalid = result.current.validateField('name', 'A');
      expect(isInvalid).toBe(false);
    });

    it('deve retornar status do campo', () => {
      const mockOnSubmit = jest.fn();
      
      const { result } = renderHook(() =>
        useReactiveForm({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      );
      
      // Campo vazio
      let status = result.current.getFieldStatus('name');
      expect(status.hasValue).toBe(false);
      expect(status.isValid).toBe(false);
      
      // Definir valor
      act(() => {
        result.current.setValue('name', 'João Silva');
      });
      
      status = result.current.getFieldStatus('name');
      expect(status.hasValue).toBe(true);
    });
  });

  describe('Submissão', () => {
    it('deve chamar onSubmit com sucesso', async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      
      const { result } = renderHook(() =>
        useReactiveForm({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      );
      
      // Preencher dados válidos
      act(() => {
        result.current.setValue('name', 'João Silva');
        result.current.setValue('email', 'joao@example.com');
      });
      
      // Submeter
      await act(async () => {
        await result.current.handleFormSubmit();
      });
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@example.com',
      });
    });

    it('deve tratar erro na submissão', async () => {
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Erro de teste'));
      
      const { result } = renderHook(() =>
        useReactiveForm({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      );
      
      // Preencher dados válidos
      act(() => {
        result.current.setValue('name', 'João Silva');
        result.current.setValue('email', 'joao@example.com');
      });
      
      // Submeter
      await act(async () => {
        await result.current.handleFormSubmit();
      });
      
      expect(mockShowError).toHaveBeenCalled();
    });
  });
});

describe('commonSchemas', () => {
  it('deve validar email corretamente', () => {
    expect(() => commonSchemas.email.parse('test@example.com')).not.toThrow();
    expect(() => commonSchemas.email.parse('invalid-email')).toThrow();
  });

  it('deve validar senha corretamente', () => {
    expect(() => commonSchemas.password.parse('12345678')).not.toThrow();
    expect(() => commonSchemas.password.parse('123')).toThrow();
  });

  it('deve validar telefone corretamente', () => {
    expect(() => commonSchemas.phone.parse('(11) 99999-9999')).not.toThrow();
    expect(() => commonSchemas.phone.parse('123')).toThrow();
  });

  it('deve validar nome corretamente', () => {
    expect(() => commonSchemas.name.parse('João Silva')).not.toThrow();
    expect(() => commonSchemas.name.parse('A')).toThrow();
  });

  it('deve validar campo obrigatório', () => {
    expect(() => commonSchemas.required.parse('valor')).not.toThrow();
    expect(() => commonSchemas.required.parse('')).toThrow();
  });
});