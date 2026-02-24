'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface StudySession {
  id: string
  subject_name: string
  duration: number
  date: string
  notes: string | null
  created_at: string
  focus_level?: number
  understanding_level?: number
  fatigue_level?: number
  efficiency_score?: number
}

type StudyMode = 'timer' | 'pomodoro' | 'manual' | 'history' | 'dashboard'

export default function StudyPage() {
  const [mode, setMode] = useState<StudyMode>('timer')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [error, setError] = useState('')
  
  // Edit/Delete states
  const [editingSession, setEditingSession] = useState<StudySession | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  // Efficiency evaluation states (será implementado futuramente)
  // const [showEvaluation, setShowEvaluation] = useState(false)
  // const [focusLevel, setFocusLevel] = useState(3)
  // const [understandingLevel, setUnderstandingLevel] = useState(3)
  // const [fatigueLevel, setFatigueLevel] = useState(3)
  // const [pendingSessionData, setPendingSessionData] = useState<{duration: number} | null>(null)
  
  // Timer states (cronômetro independente)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerTime, setTimerTime] = useState(0) // em segundos
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Pomodoro states (independente do cronômetro)
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false)
  const [isPomodoroPaused, setIsPomodoroPaused] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutos em segundos
  const pomodoroRef = useRef<NodeJS.Timeout | null>(null)
  
  const supabase = createClient()

  // Buscar sessões ao carregar a página
  useEffect(() => {
    fetchSessions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer effect (cronômetro)
  useEffect(() => {
    if (isTimerRunning && !isTimerPaused) {
      timerRef.current = setInterval(() => {
        setTimerTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning, isTimerPaused])

  // Pomodoro effect (independente)
  useEffect(() => {
    if (isPomodoroRunning && !isPomodoroPaused) {
      pomodoroRef.current = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            // Tempo acabou
            if (pomodoroMode === 'work') {
              setPomodoroMode('break')
              setPomodoroCount((count) => count + 1)
              return 5 * 60 // 5 minutos de pausa
            } else {
              setPomodoroMode('work')
              return 25 * 60 // 25 minutos de trabalho
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (pomodoroRef.current) {
        clearInterval(pomodoroRef.current)
      }
    }
    
    return () => {
      if (pomodoroRef.current) {
        clearInterval(pomodoroRef.current)
      }
    }
  }, [isPomodoroRunning, isPomodoroPaused, pomodoroMode])

  const fetchSessions = async () => {
    setLoadingSessions(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setSessions(data || [])
    } catch (err) {
      console.error('Erro ao buscar sessões:', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  // Controles do Timer (cronômetro)
  const startTimer = () => {
    if (!subject.trim()) {
      setError('Digite a matéria que está estudando')
      return
    }
    setError('')
    setIsTimerRunning(true)
    setIsTimerPaused(false)
  }

  const pauseTimer = () => {
    setIsTimerPaused(!isTimerPaused)
  }

  const stopTimer = async () => {
    setIsTimerRunning(false)
    setIsTimerPaused(false)
    
    if (timerTime > 0) {
      // Converter segundos para horas (duration na tabela é em horas)
      await saveSession(timerTime / 3600)
      setTimerTime(0)
    }
  }

  const resetTimer = () => {
    setTimerTime(0)
    setIsTimerRunning(false)
    setIsTimerPaused(false)
  }

  // Controles do Pomodoro (independente)
  const startPomodoro = () => {
    if (!subject.trim()) {
      setError('Digite a matéria que está estudando')
      return
    }
    setError('')
    setIsPomodoroRunning(true)
    setIsPomodoroPaused(false)
  }

  const pausePomodoro = () => {
    setIsPomodoroPaused(!isPomodoroPaused)
  }

  const stopPomodoro = async () => {
    setIsPomodoroRunning(false)
    setIsPomodoroPaused(false)
    
    // Calcular tempo total estudado
    let totalMinutes = pomodoroCount * 25 // Pomodoros completos
    
    // Adicionar o tempo do pomodoro atual (se estiver no modo work)
    if (pomodoroMode === 'work') {
      const currentPomodoroTime = (25 * 60) - pomodoroTime // tempo decorrido no pomodoro atual
      totalMinutes += currentPomodoroTime / 60 // converter segundos para minutos
    }
    
    if (totalMinutes > 0) {
      // Converter minutos para horas (duration na tabela é em horas)
      await saveSession(totalMinutes / 60)
    }
    
    setPomodoroTime(25 * 60)
    setPomodoroCount(0)
    setPomodoroMode('work')
  }

  const resetPomodoro = () => {
    setPomodoroTime(25 * 60)
    setPomodoroCount(0)
    setPomodoroMode('work')
    setIsPomodoroRunning(false)
    setIsPomodoroPaused(false)
  }

  // Salvar sessão no banco
  const saveSession = async (durationInHours: number) => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Você precisa estar logado')
        return
      }

      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          subject_name: subject,
          duration: durationInHours,
          date: new Date().toISOString().split('T')[0],
          notes: notes || null
        })

      if (error) throw error

      setSuccess(true)
      setSuccessMessage('Sessão de estudo registrada com sucesso!')
      
      // Recarregar sessões
      await fetchSessions()
      
      // Limpar campos
      setSubject('')
      setNotes('')
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar:', err)
      const error = err as { message?: string, code?: string }
      
      if (error.message?.includes('table') && error.message?.includes('study_sessions')) {
        setError('⚠️ Banco não configurado. Execute o SQL do arquivo SETUP_DATABASE.md')
      } else if (error.message?.includes('column') && error.message?.includes('subject_name')) {
        setError('⚠️ Tabela desatualizada. Execute o SQL do arquivo SETUP_DATABASE.md')
      } else if (error.code === '23502') {
        setError('⚠️ Campo obrigatório faltando. Verifique a configuração do banco.')
      } else if (error.code === '42P01') {
        setError('⚠️ Tabela não existe. Execute o SETUP_DATABASE.md no Supabase SQL Editor')
      } else {
        setError(error.message || 'Erro ao salvar sessão de estudo')
      }
    } finally {
      setLoading(false)
    }
  }

  // Deletar sessão
  const deleteSession = async (sessionId: string) => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Você precisa estar logado')
        return
      }

      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id)

      if (error) throw error

      setSuccess(true)
      setSuccessMessage('Sessão excluída com sucesso!')
      setDeleteConfirm(null)
      
      // Recarregar sessões
      await fetchSessions()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Erro ao deletar:', err)
      const error = err as { message?: string }
      setError(error.message || 'Erro ao deletar sessão de estudo')
    } finally {
      setLoading(false)
    }
  }

  // Atualizar sessão
  const updateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingSession) return
    
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Você precisa estar logado')
        return
      }

      const { error } = await supabase
        .from('study_sessions')
        .update({
          subject_name: subject,
          duration: parseFloat(duration) / 60, // converter minutos para horas
          notes: notes || null
        })
        .eq('id', editingSession.id)
        .eq('user_id', user.id)

      if (error) throw error

      setSuccess(true)
      setSuccessMessage('Sessão atualizada com sucesso!')
      setEditingSession(null)
      
      // Recarregar sessões
      await fetchSessions()
      
      // Limpar campos
      setSubject('')
      setDuration('')
      setNotes('')
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Erro ao atualizar:', err)
      const error = err as { message?: string }
      setError(error.message || 'Erro ao atualizar sessão de estudo')
    } finally {
      setLoading(false)
    }
  }

  // Iniciar edição de uma sessão
  const startEditing = (session: StudySession) => {
    setEditingSession(session)
    setSubject(session.subject_name)
    setDuration(String(Math.round(session.duration * 60))) // converter horas para minutos
    setNotes(session.notes || '')
    setMode('manual')
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingSession(null)
    setSubject('')
    setDuration('')
    setNotes('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Se está editando, atualiza; senão, cria nova
    if (editingSession) {
      await updateSession(e)
      return
    }
    
    if (!duration || parseFloat(duration) <= 0) {
      setError('Digite uma duração válida')
      return
    }
    
    await saveSession(parseFloat(duration) / 60)
    setDuration('')
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatDuration = (hours: number) => {
    const totalMinutes = Math.round(hours * 60)
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return h > 0 ? `${h}h ${m}min` : `${m}min`
  }

  // Calcular estatísticas
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0])
  const todayTime = todaySessions.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="h-full flex flex-col overflow-hidden py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="mb-3 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center justify-center gap-2">
            <span className="text-3xl">✍️</span>
            Registrar Estudo
          </h1>
          <p className="text-sm text-gray-400">
            Escolha um modo de estudo e comece a registrar seu progresso
          </p>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-56 flex-shrink-0 bg-[#1a1a1a] rounded-lg border border-gray-800 p-3 flex flex-col gap-1.5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">
              Modos de Estudo
            </h3>
            {[
              { id: 'timer', label: 'Cronômetro', icon: '⏱️', desc: 'Contagem progressiva' },
              { id: 'pomodoro', label: 'Pomodoro', icon: '🍅', desc: '25min foco + 5min pausa' },
              { id: 'manual', label: 'Manual', icon: '✍️', desc: 'Registro personalizado' },
              { id: 'history', label: 'Histórico', icon: '📊', desc: 'Todas as sessões' },
              { id: 'dashboard', label: 'Dashboard', icon: '📈', desc: 'Estatísticas e insights' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as StudyMode)}
                className={`flex items-start gap-2 px-3 py-2 rounded-lg font-medium transition text-left ${
                  mode === item.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#0a0a0a] text-gray-400 hover:text-white hover:bg-[#0a0a0a]/50 border border-gray-800 hover:border-[#D4AF37]/30'
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${mode === item.id ? 'text-black' : 'text-white'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${mode === item.id ? 'text-black/70' : 'text-gray-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}
          </aside>

          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                ✅ {successMessage || 'Ação realizada com sucesso!'}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                ❌ {error}
              </div>
            )}

            {/* Timer Mode */}
            {mode === 'timer' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-3">Cronômetro</h2>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-4 font-mono">
                    {formatTime(timerTime)}
                  </div>
                  
                  <div className="w-full max-w-md space-y-3">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isTimerRunning}
                      placeholder="Matéria que está estudando..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:opacity-50"
                    />
                    
                    <div className="flex gap-2">
                      {!isTimerRunning ? (
                        <button
                          onClick={startTimer}
                          className="flex-1 py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                        >
                          ▶️ Iniciar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={pauseTimer}
                            className="flex-1 py-2.5 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
                          >
                            {isTimerPaused ? '▶️ Continuar' : '⏸️ Pausar'}
                          </button>
                          <button
                            onClick={stopTimer}
                            disabled={loading}
                            className="flex-1 py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                          >
                            ⏹️ Parar e Salvar
                          </button>
                        </>
                      )}
                    </div>
                    
                    {timerTime > 0 && !isTimerRunning && (
                      <button
                        onClick={resetTimer}
                        className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition"
                      >
                        🔄 Resetar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pomodoro Mode */}
            {mode === 'pomodoro' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-2">Método Pomodoro</h2>
                <p className="text-xs text-gray-400 mb-3">
                  25min de estudo • 5min de pausa • Foco total
                </p>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className={`text-5xl sm:text-6xl font-bold mb-3 font-mono ${
                    pomodoroMode === 'work' ? 'text-[#D4AF37]' : 'text-green-400'
                  }`}>
                    {formatTime(pomodoroTime)}
                  </div>
                  
                  <div className={`text-sm font-semibold mb-4 px-3 py-1.5 rounded-full ${
                    pomodoroMode === 'work' 
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' 
                      : 'bg-green-500/10 text-green-400 border border-green-500/30'
                  }`}>
                    {pomodoroMode === 'work' ? '🍅 Tempo de Trabalho' : '☕ Tempo de Pausa'}
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4">
                    Pomodoros completados: <span className="text-white font-bold">{pomodoroCount}</span>
                  </div>
                  
                  <div className="w-full max-w-md space-y-3">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isPomodoroRunning}
                      placeholder="Matéria que está estudando..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:opacity-50"
                    />
                    
                    <div className="flex gap-2">
                      {!isPomodoroRunning ? (
                        <button
                          onClick={startPomodoro}
                          className="flex-1 py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                        >
                          ▶️ Iniciar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={pausePomodoro}
                            className="flex-1 py-2.5 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
                          >
                            {isPomodoroPaused ? '▶️ Continuar' : '⏸️ Pausar'}
                          </button>
                          <button
                            onClick={stopPomodoro}
                            disabled={loading}
                            className="flex-1 py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                          >
                            ⏹️ Parar e Salvar
                          </button>
                        </>
                      )}
                    </div>
                    
                    {pomodoroCount > 0 && !isPomodoroRunning && (
                      <button
                        onClick={resetPomodoro}
                        className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition"
                      >
                        🔄 Resetar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Manual Mode */}
            {mode === 'manual' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-white">
                    {editingSession ? '✏️ Editar Sessão' : 'Registro Manual'}
                  </h2>
                  {editingSession && (
                    <button
                      onClick={cancelEdit}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      ✕ Cancelar
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Matéria / Assunto *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Ex: Direito Constitucional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Duração (minutos) *
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      min="1"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Anotações (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                      placeholder="Descreva o que você estudou, dúvidas, pontos importantes..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-6 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : editingSession ? '✏️ Atualizar Sessão' : '📝 Registrar Sessão'}
                  </button>
                </form>
              </div>
            )}

            {/* History Mode */}
            {mode === 'history' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-lg font-bold text-white mb-3">Histórico de Estudos</h2>
                
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-[#0a0a0a] p-2.5 rounded-lg border border-gray-800 text-center">
                    <div className="text-base font-bold text-[#D4AF37]">
                      {formatDuration(totalStudyTime)}
                    </div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="bg-[#0a0a0a] p-2.5 rounded-lg border border-gray-800 text-center">
                    <div className="text-base font-bold text-green-400">
                      {formatDuration(todayTime)}
                    </div>
                    <div className="text-xs text-gray-400">Hoje</div>
                  </div>
                  <div className="bg-[#0a0a0a] p-2.5 rounded-lg border border-gray-800 text-center">
                    <div className="text-base font-bold text-blue-400">
                      {sessions.length}
                    </div>
                    <div className="text-xs text-gray-400">Sessões</div>
                  </div>
                </div>
                
                {loadingSessions ? (
                  <p className="text-gray-400 text-center py-8">Carregando...</p>
                ) : sessions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-gray-400">
                      Nenhuma sessão registrada ainda.<br/>Comece a estudar e registre seu progresso!
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {sessions.map((session) => (
                      <div 
                        key={session.id}
                        className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition"
                      >
                        {deleteConfirm === session.id ? (
                          <div className="space-y-3">
                            <p className="text-white font-semibold">
                              ⚠️ Tem certeza que deseja excluir esta sessão?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => deleteSession(session.id)}
                                disabled={loading}
                                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 text-sm"
                              >
                                {loading ? 'Excluindo...' : '✓ Sim, Excluir'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition text-sm"
                              >
                                ✕ Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-white font-semibold">{session.subject_name}</h3>
                                <p className="text-sm text-gray-400">
                                  {formatDate(session.date)} • {formatDuration(session.duration)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEditing(session)}
                                  className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 transition"
                                  title="Editar sessão"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(session.id)}
                                  className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 transition"
                                  title="Excluir sessão"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {session.notes && (
                              <p className="text-sm text-gray-500 mt-2 border-t border-gray-800 pt-2">
                                {session.notes}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dashboard Mode */}
            {mode === 'dashboard' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-lg font-bold text-white mb-3">📈 Dashboard de Desempenho</h2>
                
                {loadingSessions ? (
                  <p className="text-gray-400 text-center py-8">Carregando...</p>
                ) : sessions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-400">
                      Nenhum dado disponível ainda.<br/>Registre algumas sessões de estudo para ver suas estatísticas!
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {/* Overall Statistics */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                        <div className="text-xs text-gray-400 mb-1">Tempo Total</div>
                        <div className="text-lg font-bold text-[#D4AF37]">
                          {formatDuration(totalStudyTime)}
                        </div>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                        <div className="text-xs text-gray-400 mb-1">Hoje</div>
                        <div className="text-lg font-bold text-green-400">
                          {formatDuration(todayTime)}
                        </div>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                        <div className="text-xs text-gray-400 mb-1">Sessões</div>
                        <div className="text-lg font-bold text-blue-400">
                          {sessions.length}
                        </div>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                        <div className="text-xs text-gray-400 mb-1">Média/Sessão</div>
                        <div className="text-lg font-bold text-purple-400">
                          {formatDuration(Math.round(totalStudyTime / sessions.length))}
                        </div>
                      </div>
                    </div>

                    {/* Study by Subject */}
                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                      <h3 className="text-base font-semibold text-white mb-2">📚 Tempo por Matéria</h3>
                      <div className="space-y-2">
                        {Object.entries(
                          sessions.reduce((acc, session) => {
                            const subject = session.subject_name || 'Sem matéria'
                            acc[subject] = (acc[subject] || 0) + session.duration
                            return acc
                          }, {} as Record<string, number>)
                        )
                          .sort(([, a], [, b]) => b - a)
                          .map(([subject, duration]) => {
                            const percentage = (duration / totalStudyTime) * 100
                            return (
                              <div key={subject} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white font-medium">{subject}</span>
                                  <span className="text-gray-400">{formatDuration(duration)}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2">
                                  <div 
                                    className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                      <h3 className="text-base font-semibold text-white mb-2">⏰ Atividade Recente</h3>
                      <div className="space-y-1.5">
                        {sessions.slice(0, 5).map((session) => (
                          <div key={session.id} className="flex justify-between items-center py-1.5 border-b border-gray-800 last:border-0">
                            <div>
                              <div className="text-sm text-white font-medium">{session.subject_name}</div>
                              <div className="text-xs text-gray-500">{formatDate(session.date)}</div>
                            </div>
                            <div className="text-sm text-[#D4AF37] font-semibold">
                              {formatDuration(session.duration)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Notes (only visible on larger screens when not in history or dashboard mode) */}
          {mode !== 'history' && mode !== 'dashboard' && (
            <div className="hidden lg:block w-72 bg-[#1a1a1a] rounded-lg border border-gray-800 p-3 flex flex-col">
              <h3 className="text-base font-bold text-white mb-2">📝 Anotações para Revisão</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Faça anotações sobre o que está estudando..."
                className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none text-sm"
              />
              <div className="space-y-1.5 mt-2">
                <p className="text-xs text-gray-400">
                  {mode === 'timer' && isTimerRunning && (
                    <><span className="text-green-400">⏱️ Cronômetro ativo</span> - Suas anotações serão vinculadas a esta sessão</>
                  )}
                  {mode === 'pomodoro' && isPomodoroRunning && (
                    <><span className="text-[#D4AF37]">🍅 Pomodoro ativo</span> - Suas anotações serão vinculadas a esta sessão</>
                  )}
                  {mode === 'manual' && (
                    <>Use o formulário ao lado para registrar uma sessão de estudo com anotações</>
                  )}
                  {((mode === 'timer' && !isTimerRunning) || (mode === 'pomodoro' && !isPomodoroRunning)) && (
                    <>Inicie o {mode === 'timer' ? 'cronômetro' : 'pomodoro'} para vincular suas anotações ao ciclo de estudo</>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  💡 As anotações servem para revisão e são salvas automaticamente ao parar a sessão
                </p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
