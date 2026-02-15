'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface ResponsiveLayoutProps {
  children: ReactNode
  user: User
  profile: {
    username?: string
    is_premium?: boolean
    is_staff?: boolean
  } | null
}

export function ResponsiveLayout({ children, user, profile }: ResponsiveLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#1a1a1a] border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-black border-r border-[#D4AF37]/20 
          flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h1 className="text-2xl font-bold text-[#D4AF37]">Concurso PRO 👑</h1>
          <p className="text-xs text-gray-400 mt-1">
            {profile?.is_premium ? '✨ Membro PRO' : '🆓 Plano Gratuito'}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link 
            href="/dashboard"
            prefetch={true}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/modules"
            prefetch={true}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📚</span>
            <span>Módulos</span>
          </Link>
          <Link 
            href="/study"
            prefetch={true}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>✍️</span>
            <span>Registrar Estudo</span>
          </Link>
          <Link 
            href="/schedule"
            prefetch={true}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📅</span>
            <span>Cronograma</span>
          </Link>
          <Link 
            href="/reports"
            prefetch={true}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📈</span>
            <span>Relatórios</span>
          </Link>
          
          <div className="pt-4 border-t border-[#D4AF37]/20 mt-4">
            {!profile?.is_premium && (
              <Link 
                href="/subscription"
                prefetch={true}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#FFD700] transition mb-2"
              >
                <span>👑</span>
                <span>Assinar PRO</span>
              </Link>
            )}
            
            <Link 
              href="/profile"
              prefetch={true}
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
            >
              <span>👤</span>
              <span>Perfil</span>
            </Link>
            
            {profile?.is_staff && (
              <Link 
                href="/admin/users"
                prefetch={true}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
              >
                <span>👥</span>
                <span>Gestão de Usuários</span>
              </Link>
            )}
          </div>
        </nav>

        {/* User info e Logout */}
        <div className="p-4 border-t border-[#D4AF37]/20">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.username || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <span>🚪</span>
              <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 h-full pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
