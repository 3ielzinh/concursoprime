'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ProPopupProps {
  isPremium: boolean
}

export function ProPopup({ isPremium }: ProPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    if (isPremium) return
    
    const hasSeenPopup = localStorage.getItem('hideProPopup')
    if (hasSeenPopup) return

    // Mostrar popup após 5 segundos
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isPremium])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideProPopup', 'true')
    }
    setIsOpen(false)
  }

  if (!isOpen || isPremium) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#D4AF37] relative overflow-hidden">
        {/* Header com gradiente dourado */}
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] p-6 text-center">
          <div className="text-5xl mb-2">👑</div>
          <h2 className="text-2xl font-bold text-black">
            Desbloqueie Todo o Potencial
          </h2>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-center">
            Upgrade para o <span className="font-bold text-[#D4AF37]">Plano PRO</span> e tenha acesso a:
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Todos os módulos</strong> disponíveis
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Cronograma personalizado</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Relatórios detalhados</strong> de progresso
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Suporte prioritário</strong>
              </span>
            </li>
          </ul>

          <div className="pt-4 space-y-3">
            <Link
              href="/subscription"
              onClick={handleClose}
              className="block w-full py-3 px-6 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-center rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              🚀 Assinar Plano PRO
            </Link>

            <button
              onClick={handleClose}
              className="block w-full py-2 px-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-center transition"
            >
              Continuar com plano gratuito
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Não mostrar novamente
            </label>
          </div>
        </div>

        {/* Botão fechar */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
