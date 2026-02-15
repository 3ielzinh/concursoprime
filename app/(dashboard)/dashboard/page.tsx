import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProPopup } from '../components/ProPopup'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Buscar sessões de estudo
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  // Calcular estatísticas
  const { data: allSessions } = await supabase
    .from('study_sessions')
    .select('duration, date')
    .eq('user_id', user.id)

  const totalHours = allSessions?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0
  
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  const weekSessions = allSessions?.filter(s => new Date(s.date) >= startOfWeek) || []
  const weekHours = weekSessions.reduce((acc, s) => acc + (s.duration || 0), 0)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthSessions = allSessions?.filter(s => new Date(s.date) >= startOfMonth) || []
  const monthHours = monthSessions.reduce((acc, s) => acc + (s.duration || 0), 0)

  // Calcular sequência de dias
  const sortedDates = [...new Set(allSessions?.map(s => s.date) || [])].sort().reverse()
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const dateStr of sortedDates) {
    const sessionDate = new Date(dateStr)
    sessionDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak) {
      streak++
      currentDate = sessionDate
    } else if (diffDays > streak) {
      break
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const formatDuration = (hours: number) => {
    const totalMinutes = Math.round(hours * 60)
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return h > 0 ? `${h}h ${m}min` : `${m}min`
  }

  const categories = [
    { name: 'Carreiras Policiais', icon: '🛡️', color: 'text-blue-400' },
    { name: 'Carreiras Militares', icon: '⭐', color: 'text-green-400' },
    { name: 'Carreiras Bancárias', icon: '🏦', color: 'text-cyan-400' },
    { name: 'Administrativa', icon: '📋', color: 'text-gray-400' },
    { name: 'ENEM/Vestibulares', icon: '🎓', color: 'text-blue-500' },
  ]

  return (
    <>
      <ProPopup isPremium={profile?.is_premium || false} />
      
      <div className="space-y-4 sm:space-y-6">
        {/* Header com botão */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📊</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <Link
            href="/study"
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <span>⊕</span>
            <span>Registrar Estudo</span>
          </Link>
        </div>

        {/* Stats Cards - 4 cards no topo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1 - Total de Horas */}
          <div className="bg-[#1a1a1a] border-l-4 border-blue-500 rounded-lg p-3 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">TOTAL DE HORAS</p>
                <p className="text-3xl font-bold text-white">{totalHours.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 - Esta Semana */}
          <div className="bg-[#1a1a1a] border-l-4 border-green-500 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">ESTA SEMANA</p>
                <p className="text-3xl font-bold text-white">{weekHours.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3 - Este Mês */}
          <div className="bg-[#1a1a1a] border-l-4 border-cyan-500 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">ESTE MÊS</p>
                <p className="text-3xl font-bold text-white">{monthHours.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4 - Sequência */}
          <div className="bg-[#1a1a1a] border-l-4 border-orange-500 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">SEQUÊNCIA</p>
                <p className="text-3xl font-bold text-white">{streak} dias</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <span className="text-3xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Principal - 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Progresso Geral e Sessões Recentes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progresso Geral */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📊</span>
                  Progresso Geral
                </h2>
                <Link
                  href="/reports"
                  className="text-sm text-blue-400 hover:text-blue-300 border border-blue-400 hover:border-blue-300 px-4 py-2 rounded transition"
                >
                  Ver Relatório Completo
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Disciplinas Concluídas</p>
                    <p className="text-2xl font-bold text-white">0 / 3</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Progresso Médio</p>
                    <p className="text-2xl font-bold text-white">0,0%</p>
                  </div>
                </div>
              </div>

              <div className="text-center py-8 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Maior Sequência de Estudos:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl">🏆</span>
                  <span className="text-3xl font-bold text-[#D4AF37]">{streak} dias</span>
                </div>
              </div>
            </div>

            {/* Sessões Recentes */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🕐</span>
                  Sessões Recentes
                </h2>
                <Link
                  href="/study"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Adicionar
                </Link>
              </div>

              {!sessions || sessions.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">📊</span>
                    <p className="text-gray-400">Nenhuma sessão registrada ainda</p>
                    <p className="text-gray-500 text-sm mt-2">Comece registrando sua primeira sessão de estudos</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div 
                      key={session.id}
                      className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{session.subject_name}</h3>
                          <p className="text-sm text-gray-400 mb-1">
                            {formatDate(session.date)} • {formatDuration(session.duration)}
                          </p>
                          {session.notes && (
                            <p className="text-sm text-gray-500 line-clamp-2">{session.notes}</p>
                          )}
                        </div>
                        <span className="text-2xl ml-3">📚</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita - Acesso Rápido */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 h-full">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span>⚡</span>
                Acesso Rápido
              </h2>

              <div className="space-y-3 mb-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href="/modules"
                    className="flex items-center gap-3 p-3 bg-[#0a0a0a] hover:bg-gray-900 rounded-lg transition border border-gray-800 hover:border-gray-700"
                  >
                    <span className={`text-2xl ${category.color}`}>{category.icon}</span>
                    <span className="text-white font-medium text-sm">{category.name}</span>
                  </Link>
                ))}
              </div>

              {!profile?.is_premium && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xl">ℹ️</span>
                    <p className="text-sm text-blue-300">
                      Faça upgrade para acessar todas as categorias!
                    </p>
                  </div>
                  <Link
                    href="/subscription"
                    className="block w-full text-center py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition"
                  >
                    Ver Planos
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
