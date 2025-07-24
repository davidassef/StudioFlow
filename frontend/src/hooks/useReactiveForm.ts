import { useForm, UseFormProps, FieldValues, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect } from 'react'
import { useNotifications } from '@/stores/notificationStore'

interface UseReactiveFormProps<T extends FieldValues> extends UseFormProps<T> {
  schema: z.ZodType<T, z.ZodTypeDef, T>
  onSubmit: (data: T) => Promise<void> | void
  onSuccess?: (data: T) => void
  onError?: (error: unknown) => void
  successMessage?: string
  errorMessage?: string
  enableRealTimeValidation?: boolean
}

export function useReactiveForm<T extends FieldValues>({
  schema,
  onSubmit,
  onSuccess,
  onError,
  successMessage = 'Operação realizada com sucesso!',
  errorMessage = 'Ocorreu um erro. Tente novamente.',
  enableRealTimeValidation = true,
  ...formProps
}: UseReactiveFormProps<T>) {
  const { showSuccess, showError } = useNotifications()
  
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    mode: enableRealTimeValidation ? 'onChange' : 'onSubmit',
    ...formProps,
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    watch,
    setError,
    clearErrors,
  } = form

  // Validação em tempo real para campos específicos
  const watchedValues = watch()

  useEffect(() => {
    if (enableRealTimeValidation && Object.keys(watchedValues).length > 0) {
      // Validar apenas os campos que foram alterados
      const result = schema.safeParse(watchedValues)
      if (!result.success) {
        result.error.errors.forEach((error) => {
          const fieldName = error.path[0] as Path<T>
          if (fieldName && watchedValues[fieldName] !== undefined) {
            setError(fieldName, {
              type: 'validation',
              message: error.message,
            })
          }
        })
      } else {
        // Limpar erros se a validação passou
        Object.keys(errors).forEach((fieldName) => {
          if (watchedValues[fieldName as keyof T] !== undefined) {
            clearErrors(fieldName as Path<T>)
          }
        })
      }
    }
  }, [watchedValues, schema, setError, clearErrors, errors, enableRealTimeValidation])

  const handleFormSubmit = handleSubmit(async (data: T) => {
    try {
      await onSubmit(data)
      showSuccess('Sucesso', successMessage)
      onSuccess?.(data)
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } }; message?: string }
      const message = errorObj?.response?.data?.message || errorObj?.message || errorMessage
      showError('Erro', message)
      onError?.(error)
      
      // Se o erro contém informações de campo específico, aplicar aos campos
      const errorWithResponse = error as { response?: { data?: { errors?: Record<string, string | string[]> } } }
      if (errorWithResponse?.response?.data?.errors) {
        Object.entries(errorWithResponse.response.data.errors).forEach(([field, messages]) => {
          setError(field as Path<T>, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      }
    }
  })

  // Função para validar um campo específico
  const validateField = (fieldName: Path<T>, value: unknown) => {
    try {
      // Validar o objeto completo e verificar se o campo específico tem erro
      const testData = { ...watchedValues, [fieldName]: value } as T
      const result = schema.safeParse(testData)
      
      if (result.success) {
        clearErrors(fieldName)
        return true
      } else {
        const fieldError = result.error.errors.find(err => err.path[0] === fieldName)
        if (fieldError) {
          setError(fieldName, {
            type: 'validation',
            message: fieldError.message,
          })
          return false
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Campo inválido'
      setError(fieldName, {
        type: 'validation',
        message: errorMessage,
      })
      return false
    }
    return true
  }

  // Função para obter o status de validação de um campo
  const getFieldStatus = (fieldName: Path<T>) => {
    const hasError = !!errors[fieldName]
    const value = watchedValues[fieldName]
    const hasValue = value !== undefined && value !== '' && value !== null
    
    return {
      hasError,
      hasValue,
      isValid: hasValue && !hasError,
      error: errors[fieldName]?.message,
    }
  }

  return {
    ...form,
    handleFormSubmit,
    validateField,
    getFieldStatus,
    isSubmitting,
    isValid,
    errors,
  }
}

// Schemas comuns para reutilização
export const commonSchemas = {
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  phone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  required: z.string().min(1, 'Campo obrigatório'),
}