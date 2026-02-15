'use client'

import { useState } from 'react'

interface ScheduleItem {
  day: string
  hour: number
  subject: string
  color: string
}

export default function SchedulePage() {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const hours = Array.from({ length: 24 }, (_, i) => i) // 0h às 23h
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: number } | null>(null)
  const [subject, setSubject] = useState('')
  const [color, setColor] = useState('#3B82F6')
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])

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

  const handleCellClick = (day: string, hour: number) => {
    setSelectedCell({ day, hour })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (selectedCell && subject) {
      const newItem: ScheduleItem = {
        day: selectedCell.day,
        hour: selectedCell.hour,
        subject,
        color
      }
      setScheduleItems([...scheduleItems, newItem])
      setIsModalOpen(false)
      setSubject('')
      setColor('#3B82F6')
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSubject('')
    setColor('#3B82F6')
  }

  const getScheduleItem = (day: string, hour: number) => {
    return scheduleItems.find(item => item.day === day && item.hour === hour)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">📅</span>
          Cronograma de Estudos
        </h1>
        <p className="text-gray-400">
          Organize sua rotina de estudos semanalmente
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 flex-1 flex flex-col overflow-hidden">
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
                      return (
                        <td
                          key={`${day}-${hour}`}
                          onClick={() => handleCellClick(day, hour)}
                          className="border border-gray-700 p-2 hover:bg-[#D4AF37]/10 cursor-pointer transition bg-black"
                          style={item ? { backgroundColor: item.color + '20', borderLeft: `3px solid ${item.color}` } : {}}
                        >
                          <div className="h-10 flex items-center justify-center text-xs font-medium text-white">
                            {item?.subject}
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
              💡 <strong>Dica:</strong> Clique em um horário para adicionar uma matéria ao seu cronograma
            </p>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 text-center">
            <div className="text-2xl mb-1">⏰</div>
            <h3 className="text-sm font-semibold text-white">
              Horas Planejadas
            </h3>
            <p className="text-2xl font-bold text-[#D4AF37] mt-1">{scheduleItems.length}h</p>
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
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📝</span>
              Adicionar ao Cronograma
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horário Selecionado
                </label>
                <div className="px-4 py-3 rounded-lg bg-[#0a0a0a] text-white border border-gray-700">
                  {selectedCell?.day} - {String(selectedCell?.hour).padStart(2, '0')}:00
                </div>
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
                  Cor
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
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!subject}
                className="flex-1 px-4 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
