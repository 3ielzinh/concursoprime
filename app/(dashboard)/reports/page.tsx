export default function ReportsPage() {
  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">📈</span>
          Relatórios e Progresso
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Acompanhe sua evolução ao longo do tempo
        </p>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-[#1a1a1a] p-3 sm:p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total de Horas</h3>
            <span className="text-2xl">⏱️</span>
          </div>
          <p className="text-3xl font-bold text-[#D4AF37]">0h</p>
          <p className="text-sm text-green-400 mt-1">+0% vs semana passada</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Média Diária</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-[#D4AF37]">0h</p>
          <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Sequência</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-3xl font-bold text-[#D4AF37]">0</p>
          <p className="text-sm text-gray-500 mt-1">dias consecutivos</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Matérias</h3>
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-[#D4AF37]">0</p>
          <p className="text-sm text-gray-500 mt-1">diferentes estudadas</p>
        </div>
      </div>

      {/* Gráfico de Progresso Semanal */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Horas de Estudo - Últimos 7 Dias
        </h2>
        <div className="h-64 flex items-end justify-around gap-4">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-800 rounded-t h-48 relative">
                <div className="absolute bottom-0 w-full bg-[#D4AF37] rounded-t h-0"></div>
              </div>
              <span className="text-sm text-gray-400 mt-2">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matérias Mais Estudadas */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">
          📚 Matérias Mais Estudadas
        </h2>
        <p className="text-gray-400 text-center py-8">
          Nenhum dado disponível ainda. Comece a registrar seus estudos!
        </p>
      </div>
    </div>
  )
}
