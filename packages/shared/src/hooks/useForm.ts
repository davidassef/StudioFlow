import { useState, useCallback, useEffect } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormField {
  value: any;
  error?: string;
  touched: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  
  // Field methods
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (field: keyof T, touched?: boolean) => void;
  setFieldTouched: (field: keyof T) => void;
  
  // Form methods
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  validate: () => boolean;
  validateField: (field: keyof T) => boolean;
  
  // Field helpers
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
    touched: boolean;
  };
}

/**
 * Custom hook for form management with validation
 */
export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
  } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate derived state
  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  // Validate a single field
  const validateField = useCallback((field: keyof T): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrorsState(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field);
        if (fieldError) {
          setErrorsState(prev => ({
            ...prev,
            [field]: fieldError.message,
          }));
          return false;
        }
      }
      return true;
    }
  }, [values, validationSchema]);

  // Validate all fields
  const validate = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrorsState({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof T;
          if (field) {
            newErrors[field] = err.message;
          }
        });
        setErrorsState(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  // Set single field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnChange, validateField]);

  // Set multiple values
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
    
    if (validateOnChange) {
      setTimeout(() => validate(), 0);
    }
  }, [validateOnChange, validate]);

  // Set single field error
  const setError = useCallback((field: keyof T, error: string) => {
    setErrorsState(prev => ({ ...prev, [field]: error }));
  }, []);

  // Set multiple errors
  const setErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrorsState(prev => ({ ...prev, ...newErrors }));
  }, []);

  // Set field as touched
  const setTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouchedState(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  // Set field as touched (alias)
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(field, true);
    
    if (validateOnBlur) {
      setTimeout(() => validateField(field), 0);
    }
  }, [setTouched, validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouchedState(allTouched);

    // Validate form
    const isFormValid = validate();
    
    if (!isFormValid || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  // Reset form
  const handleReset = useCallback(() => {
    setValuesState(initialValues);
    setErrorsState({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback((field: keyof T) => {
    return {
      value: values[field],
      onChange: (value: any) => setValue(field, value),
      onBlur: () => setFieldTouched(field),
      error: errors[field],
      touched: touched[field] || false,
    };
  }, [values, errors, touched, setValue, setFieldTouched]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    setFieldTouched,
    handleSubmit,
    handleReset,
    validate,
    validateField,
    getFieldProps,
  };
}

/**
 * Hook for managing form arrays (dynamic fields)
 */
export function useFormArray<T>(
  initialItems: T[] = [],
  defaultItem: T
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = useCallback((item?: T) => {
    setItems(prev => [...prev, item || defaultItem]);
  }, [defaultItem]);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, item: T) => {
    setItems(prev => prev.map((prevItem, i) => i === index ? item : prevItem));
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
  }, []);

  const resetItems = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    resetItems,
    setItems,
  };
}

/**
 * Hook for form field validation
 */
export function useFieldValidation<T>(
  value: T,
  validationSchema?: ZodSchema<T>,
  validateOnChange: boolean = false
) {
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(value);
      setError(undefined);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0]?.message);
      }
      return false;
    }
  }, [value, validationSchema]);

  useEffect(() => {
    if (validateOnChange && touched) {
      validate();
    }
  }, [value, validateOnChange, touched, validate]);

  const onBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  return {
    error,
    touched,
    validate,
    onBlur,
    setTouched,
  };
}