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

    // Aplicar classes CSS primeiro
    element.classList.add('studioflow-gold', 'studioflow-gold-fallback');

    // Aplicar estilos diretamente via JavaScript para garantir que funcionem
    element.style.setProperty('background', 'linear-gradient(90deg, #FFD700 0%, #FFED4E 20%, #FFA500 40%, #FFD700 60%, #FFFF00 80%, #FFD700 100%)', 'important');
    element.style.setProperty('background-size', '600% 600%', 'important');
    element.style.setProperty('-webkit-background-clip', 'text', 'important');
    element.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    element.style.setProperty('background-clip', 'text', 'important');
    element.style.setProperty('animation', 'shimmer-gold-super 1.5s linear infinite', 'important');
    element.style.setProperty('text-shadow', '0 0 50px rgba(255, 215, 0, 0.9)', 'important');
    element.style.setProperty('filter', 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))', 'important');
    element.style.setProperty('color', '#FFD700', 'important');
    element.style.setProperty('font-weight', 'bold', 'important');
    element.style.setProperty('position', 'relative', 'important');
    element.style.setProperty('z-index', '10', 'important');
    
    // Fallback para navegadores que não suportam background-clip
    const supportsBackgroundClip = CSS.supports('-webkit-background-clip', 'text');
    if (!supportsBackgroundClip) {
      element.style.setProperty('-webkit-text-fill-color', '#FFD700', 'important');
      element.style.setProperty('color', '#FFD700', 'important');
      element.style.setProperty('text-shadow', '0 0 15px rgba(255, 215, 0, 1), 0 0 25px rgba(255, 215, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6)', 'important');
      element.style.setProperty('animation', 'super-glow-pulse 1.5s ease-in-out infinite alternate', 'important');
    }
  }, []);

  return (
    <span 
      ref={textRef}
      className={`${sizeClasses[size]} font-bold studioflow-gold studioflow-gold-fallback ${className}`}
      style={{
        // Estilos inline como backup triplo
        background: 'linear-gradient(90deg, #FFD700 0%, #FFED4E 20%, #FFA500 40%, #FFD700 60%, #FFFF00 80%, #FFD700 100%) !important',
        backgroundSize: '600% 600% !important',
        WebkitBackgroundClip: 'text !important',
        WebkitTextFillColor: 'transparent !important',
        backgroundClip: 'text !important',
        animation: 'shimmer-gold-super 1.5s linear infinite !important',
        textShadow: '0 0 50px rgba(255, 215, 0, 0.9) !important',
        filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.7)) !important',
        color: '#FFD700 !important',
        fontWeight: 'bold !important',
        position: 'relative !important',
        zIndex: '10 !important'
      }}
    >
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