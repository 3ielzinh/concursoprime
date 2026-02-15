'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface StudySession {
  id: string
  subject_name: string
  duration: number
  date: string
  notes: string | null
  created_at: string
}

export default function StudyPage() {
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Buscar sessões ao carregar a página
  useEffect(() => {
    fetchSessions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        .limit(10)

      if (error) throw error
      
      setSessions(data || [])
    } catch (err) {
      console.error('Erro ao buscar sessões:', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          duration: parseFloat(duration) / 60, // converter minutos para horas
          date: new Date().toISOString().split('T')[0],
          notes: notes || null
        })

      if (error) throw error

      setSuccess(true)
      setSubject('')
      setDuration('')
      setNotes('')
      
      // Recarregar sessões
      await fetchSessions()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar:', err)
      const error = err as { message?: string, code?: string }
      
      // Mensagem amigável para erros comuns
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

  return (
    <div className="flex items-center justify-center min-h-full px-4">
      <div className="w-full max-w-2xl">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl">✍️</span>
          Registrar Estudo
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Registre suas sessões de estudo e acompanhe seu progresso
        </p>
      </div>

      <div>
        <div className="bg-[#1a1a1a] p-4 sm:p-8 rounded-lg border border-gray-800">
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
              ✅ Sessão de estudo registrada com sucesso!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Matéria / Assunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Ex: Direito Constitucional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duração (minutos)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Anotações (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Descreva o que você estudou, dúvidas, etc..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Salvando...' : '📝 Registrar Sessão'}
            </button>
          </form>
        </div>

        {/* Histórico recente */}
        <div className="mt-8 bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">
            📊 Últimas Sessões
          </h2>
          
          {loadingSessions ? (
            <p className="text-gray-400 text-center py-8">Carregando...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nenhuma sessão registrada ainda. Comece registrando sua primeira sessão!
            </p>
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
                      <p className="text-sm text-gray-400 mb-2">
                        {formatDate(session.date)} • {formatDuration(session.duration)}
                      </p>
                      {session.notes && (
                        <p className="text-sm text-gray-500">{session.notes}</p>
                      )}
                    </div>
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
