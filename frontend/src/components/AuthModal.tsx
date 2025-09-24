'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Lazy load the actual modal component
const AuthModalContent = lazy(() => import('./AuthModalContent'))

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  action: string
}

export default function AuthModal({ isOpen, onClose, action }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <Suspense
      fallback={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/50 p-8 flex items-center justify-center"
          >
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Carregando...</span>
            </div>
          </motion.div>
        </motion.div>
      }
    >
      <AuthModalContent isOpen={isOpen} onClose={onClose} action={action} />
    </Suspense>
  )
}