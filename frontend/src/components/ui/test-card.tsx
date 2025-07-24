import React from 'react'

// Componente de teste simples para verificar se o problema é com os imports
export const TestCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      {children}
    </div>
  )
}

export const TestCardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col space-y-1.5 mb-4">
      {children}
    </div>
  )
}

export const TestCardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="text-2xl font-semibold leading-none tracking-tight">
      {children}
    </h3>
  )
}

export const TestCardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-0">
      {children}
    </div>
  )
}