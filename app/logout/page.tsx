'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    async function signOut() {
      try {
        // Limpar sessão do Supabase
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('Erro ao fazer logout:', error)
          setStatus('error')
          return
        }

        setStatus('success')
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
          router.push('/login')
          router.refresh()
        }, 1500)
      } catch (error) {
        console.error('Erro inesperado:', error)
        setStatus('error')
      }
    }

    signOut()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-white mb-2">Saindo...</h2>
            <p className="text-gray-400">Limpando sua sessão</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-white mb-2">Logout realizado!</h2>
            <p className="text-gray-400">Redirecionando para login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-white mb-2">Erro ao fazer logout</h2>
            <p className="text-gray-400 mb-4">Tente limpar os cookies manualmente</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
            >
              Ir para Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
