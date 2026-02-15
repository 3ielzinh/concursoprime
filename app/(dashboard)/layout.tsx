import { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-[#D4AF37]/20 flex flex-col">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h1 className="text-2xl font-bold text-[#D4AF37]">Concurso PRO 👑</h1>
          <p className="text-xs text-gray-400 mt-1">
            {profile?.is_premium ? '✨ Membro PRO' : '🆓 Plano Gratuito'}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/dashboard"
            prefetch={true}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/modules"
            prefetch={true}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📚</span>
            <span>Módulos</span>
          </Link>
          <Link 
            href="/study"
            prefetch={true}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>✍️</span>
            <span>Registrar Estudo</span>
          </Link>
          <Link 
            href="/schedule"
            prefetch={true}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
          >
            <span>📅</span>
            <span>Cronograma</span>
          </Link>
          <Link 
            href="/reports"
            prefetch={true}
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#FFD700] transition mb-2"
              >
                <span>👑</span>
                <span>Assinar PRO</span>
              </Link>
            )}
            
            <Link 
              href="/profile"
              prefetch={true}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
            >
              <span>👤</span>
              <span>Perfil</span>
            </Link>
            
            {profile?.is_staff && (
              <Link 
                href="/admin/users"
                prefetch={true}
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
              {user.email?.[0].toUpperCase()}
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
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
