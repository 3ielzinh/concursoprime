'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ScheduleItem {
  id?: string
  day: string
  hour: number
  endHour: number
  subject: string
  color: string
}

interface DatabaseSchedule {
  id: string
  user_id: string
  subject_name: string
  day_of_week: number
  start_time: string
  end_time: string
  color: string
  is_active: boolean
}

export default function SchedulePage() {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const hours = Array.from({ length: 24 }, (_, i) => i) // 0h às 23h
  const supabase = createClient()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: number } | null>(null)
  const [subject, setSubject] = useState('')
  const [startHour, setStartHour] = useState(0)
  const [endHour, setEndHour] = useState(1)
  const [color, setColor] = useState('#3B82F6')
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingSchedules, setLoadingSchedules] = useState(true)
  const [error, setError] = useState('')

  const colors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Laranja', value: '#F59E0B' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Ciano', value: '#06B6D4' },
    { name: 'Dourado', value: '#D4AF37' },
  ]

  // Carregar cronogramas ao montar o componente
  useEffect(() => {
    fetchSchedules()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Converter dia da semana de string para número (0 = Seg, 6 = Dom)
  const dayToNumber = (day: string): number => {
    return days.indexOf(day)
  }

  // Converter número para dia da semana
  const numberToDay = (num: number): string => {
    return days[num] || 'Seg'
  }

  // Converter hora para formato TIME (HH:MM:SS)
  const hourToTime = (hour: number): string => {
    return `${String(hour).padStart(2, '0')}:00:00`
  }

  // Converter TIME para hora (extrair apenas a hora)
  const timeToHour = (time: string): number => {
    return parseInt(time.split(':')[0])
  }

  // Buscar cronogramas do banco de dados
  const fetchSchedules = async () => {
    setLoadingSchedules(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Você precisa estar logado')
        return
      }

      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error
      
      // Converter dados do banco para o formato da interface
      const items: ScheduleItem[] = (data || []).map((schedule: DatabaseSchedule) => ({
        id: schedule.id,
        day: numberToDay(schedule.day_of_week),
        hour: timeToHour(schedule.start_time),
        endHour: timeToHour(schedule.end_time),
        subject: schedule.subject_name,
        color: schedule.color || '#3B82F6'
      }))

      setScheduleItems(items)
    } catch (err) {
      console.error('Erro ao buscar cronogramas:', err)
      const error = err as { message?: string, code?: string }
      
      if (error.message?.includes('schedules')) {
        setError('⚠️ Tabela de cronogramas não configurada. Execute as migrações do banco.')
      } else {
        setError(error.message || 'Erro ao carregar cronogramas')
      }
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleCellClick = (day: string, hour: number) => {
    // Verificar se já existe um item nessa célula
    const existingItem = getScheduleItem(day, hour)
    
    if (existingItem) {
      // Se existe, abrir modal para editar/excluir
      setEditingItem(existingItem)
      setSelectedCell({ day, hour })
      setSubject(existingItem.subject)
      setStartHour(existingItem.hour)
      setEndHour(existingItem.endHour)
      setColor(existingItem.color)
    } else {
      // Se não existe, criar novo
      setEditingItem(null)
      setSelectedCell({ day, hour })
      setStartHour(hour)
      setEndHour(hour + 1)
      setSubject('')
      setColor('#3B82F6')
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedCell || !subject || startHour >= endHour) return
    
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Você precisa estar logado')
        return
      }

      if (editingItem && editingItem.id) {
        // Atualizar item existente
        const { error } = await supabase
          .from('schedules')
          .update({
            subject_name: subject,
            day_of_week: dayToNumber(selectedCell.day),
            start_time: hourToTime(startHour),
            end_time: hourToTime(endHour),
            color: color
          })
          .eq('id', editingItem.id)
          .eq('user_id', user.id)

        if (error) throw error

        // Atualizar localmente
        const updatedItems = scheduleItems.map(item => 
          item.id === editingItem.id
            ? {
                ...item,
                day: selectedCell.day,
                hour: startHour,
                endHour: endHour,
                subject,
                color
              }
            : item
        )
        setScheduleItems(updatedItems)
      } else {
        // Criar novo item
        const { data, error } = await supabase
          .from('schedules')
          .insert({
            user_id: user.id,
            subject_name: subject,
            day_of_week: dayToNumber(selectedCell.day),
            start_time: hourToTime(startHour),
            end_time: hourToTime(endHour),
            color: color,
            is_active: true
          })
          .select()

        if (error) throw error

        // Adicionar localmente
        if (data && data[0]) {
          const newItem: ScheduleItem = {
            id: data[0].id,
            day: selectedCell.day,
            hour: startHour,
            endHour: endHour,
            subject,
            color
          }
          setScheduleItems([...scheduleItems, newItem])
        }
      }
      
      handleClose()
    } catch (err) {
      console.error('Erro ao salvar cronograma:', err)
      const error = err as { message?: string }
      setError(error.message || 'Erro ao salvar cronograma')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!editingItem || !editingItem.id) return
    
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Você precisa estar logado')
        return
      }

      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', editingItem.id)
        .eq('user_id', user.id)

      if (error) throw error

      // Remover localmente
      const filtered = scheduleItems.filter(item => item.id !== editingItem.id)
      setScheduleItems(filtered)
      
      handleClose()
    } catch (err) {
      console.error('Erro ao excluir cronograma:', err)
      const error = err as { message?: string }
      setError(error.message || 'Erro ao excluir cronograma')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setSubject('')
    setStartHour(0)
    setEndHour(1)
    setColor('#3B82F6')
  }

  const getScheduleItem = (day: string, hour: number) => {
    return scheduleItems.find(item => 
      item.day === day && hour >= item.hour && hour < item.endHour
    )
  }

  // Calcular total de horas planejadas
  const totalPlannedHours = scheduleItems.reduce((sum, item) => 
    sum + (item.endHour - item.hour), 0
  )

  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6 h-full flex flex-col">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">📅</span>
          Cronograma de Estudos
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Organize sua rotina de estudos semanalmente
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          ❌ {error}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3 sm:gap-4 overflow-hidden">
        <div className="bg-[#1a1a1a] p-3 sm:p-6 rounded-lg border border-gray-800 flex-1 flex flex-col overflow-hidden">
          {loadingSchedules ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-center py-8">Carregando cronograma...</p>
            </div>
          ) : (
            <>
              {/* Calendário Semanal */}
              <div className="overflow-x-auto overflow-y-auto border border-gray-700 rounded-lg flex-1">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-700 p-2 bg-[#0a0a0a] text-sm font-semibold text-gray-400">
                    Horário
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border border-gray-700 p-2 bg-[#0a0a0a] text-sm font-semibold text-white"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td className="border border-gray-700 p-2 bg-[#0a0a0a] text-sm font-medium text-gray-400 text-center">
                      {String(hour).padStart(2, '0')}:00
                    </td>
                    {days.map((day) => {
                      const item = getScheduleItem(day, hour)
                      const isFirstHour = item && item.hour === hour
                      const isInRange = item && hour >= item.hour && hour < item.endHour
                      
                      return (
                        <td
                          key={`${day}-${hour}`}
                          onClick={() => handleCellClick(day, hour)}
                          className={`border border-gray-700 p-2 hover:bg-[#D4AF37]/10 cursor-pointer transition bg-black ${
                            isInRange ? 'border-t-0' : ''
                          }`}
                          style={
                            isInRange 
                              ? { 
                                  backgroundColor: item.color + '20', 
                                  borderLeft: `3px solid ${item.color}`,
                                  borderTop: isFirstHour ? undefined : '0'
                                } 
                              : {}
                          }
                        >
                          <div className="h-10 flex items-center justify-center text-xs font-medium text-white">
                            {isFirstHour && (
                              <div className="text-center">
                                <div className="font-semibold">{item.subject}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">
                                  {String(item.hour).padStart(2, '0')}:00 - {String(item.endHour).padStart(2, '0')}:00
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 <strong>Dica:</strong> Clique em um horário para adicionar um bloco de estudo. Clique em horários já preenchidos para editar ou excluir.
            </p>
          </div>
            </>
          )}
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-2xl mb-1">⏰</div>
            <h3 className="text-sm font-semibold text-white">
              Horas Planejadas
            </h3>
            <p className="text-2xl font-bold text-[#D4AF37] mt-1">{totalPlannedHours}h</p>
            <p className="text-xs text-gray-500 mt-1">Esta semana</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-2xl mb-1">📚</div>
            <h3 className="text-sm font-semibold text-white">
              Matérias
            </h3>
            <p className="text-2xl font-bold text-[#D4AF37] mt-1">{new Set(scheduleItems.map(i => i.subject)).size}</p>
            <p className="text-xs text-gray-500 mt-1">No cronograma</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <h3 className="text-sm font-semibold text-white">
              Cumprimento
            </h3>
            <p className="text-2xl font-bold text-[#D4AF37] mt-1">0%</p>
            <p className="text-xs text-gray-500 mt-1">Da meta semanal</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>{editingItem ? '✏️' : '📝'}</span>
              {editingItem ? 'Editar Horário' : 'Adicionar ao Cronograma'}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                ❌ {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dia da Semana
                </label>
                <div className="px-4 py-3 rounded-lg bg-[#0a0a0a] text-white border border-gray-700 font-medium">
                  {selectedCell?.day}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora Inicial *
                  </label>
                  <select
                    value={startHour}
                    onChange={(e) => {
                      const newStart = parseInt(e.target.value)
                      setStartHour(newStart)
                      if (newStart >= endHour) {
                        setEndHour(Math.min(newStart + 1, 23))
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora Final *
                  </label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    {hours.filter(h => h > startHour).map(h => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, '0')}:00
                      </option>
                    ))}
                    <option value={24}>24:00</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400">
                  ⏱️ Duração: <span className="text-white font-semibold">{endHour - startHour}h</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Matéria / Assunto *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Ex: Direito Constitucional"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cor do Bloco
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`h-10 rounded-lg border-2 transition ${
                        color === c.value ? 'border-white scale-110' : 'border-gray-700'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {editingItem && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                  title="Excluir este horário"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {loading ? 'Excluindo...' : ''}
                </button>
              )}
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!subject || startHour >= endHour || loading}
                className="flex-1 px-4 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : editingItem ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
