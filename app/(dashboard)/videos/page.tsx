'use client'

export default function VideosPage() {
  const handleOpenDailymotion = () => {
    window.open('https://www.dailymotion.com/ConcursoPublicoBrasil/playlists', '_blank', 'noopener,noreferrer')
  }

  const features = [
    {
      icon: '📚',
      title: 'Aulas Completas',
      description: 'Conteúdo sobre concursos públicos'
    },
    {
      icon: '🎯',
      title: 'Playlists Organizadas',
      description: 'Material estruturado por temas'
    },
    {
      icon: '🆓',
      title: 'Acesso Gratuito',
      description: 'Conteúdo sem custos adicionais'
    },
    {
      icon: '📱',
      title: 'Assista Onde Quiser',
      description: 'Acesse de qualquer dispositivo'
    }
  ]

  return (
    <div className="h-full flex items-center justify-center py-4 overflow-hidden">
      <div className="w-full max-w-6xl px-6">
        {/* Header Compacto */}
        <div className="mb-6 text-center">
          <div className="inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-3xl shadow-lg shadow-[#D4AF37]/20">
              📹
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Videoaulas Gratuitas
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Acesse nossa biblioteca completa de videoaulas sobre concursos públicos
          </p>
        </div>

        {/* Main Card Compacto */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-6 sm:p-8 text-center border-b border-gray-800">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTIwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTIwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wIDIwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMjAgMjBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-4">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Conteúdo Exclusivo
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Canal Concurso Público Brasil
              </h2>
              
              <p className="text-gray-300 text-sm sm:text-base mb-5 max-w-2xl mx-auto">
                Centenas de horas de conteúdo educativo. Assista quando e onde quiser!
              </p>
              
              <button
                onClick={handleOpenDailymotion}
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-base rounded-lg transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-105 transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Acessar Videoaulas</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <p className="text-xs text-gray-500 mt-3">
                🔗 Você será redirecionado para o Dailymotion
              </p>
            </div>
          </div>

          {/* Features Grid Compacto */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-300 text-center"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
