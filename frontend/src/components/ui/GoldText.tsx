'use client';

import { useEffect, useRef } from 'react';

interface GoldTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GoldText({ children, className = '', size = 'md' }: GoldTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-7xl'
  };

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    // Aplicar classe simples que depende das variáveis CSS
    element.classList.add('gold-text');
  }, []);

  return (
    <span ref={textRef} className={`${sizeClasses[size]} font-bold gold-text ${className}`}>
      {children}
    </span>
  );
}

// Componente específico para o logo
export function StudioFlowLogo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <GoldText className={className} size={size}>
      StudioFlow
    </GoldText>
  );
}