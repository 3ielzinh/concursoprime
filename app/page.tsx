import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-[#D4AF37]">
            Concurso PRO 🎯
          </h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] dark:hover:text-[#FFD700] font-medium transition"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg shadow-lg transition-all duration-200"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
        <div className="max-w-4xl text-center py-20">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6">
              ✨ Plataforma de Estudos Inteligente
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Sua aprovação{' '}
            <span className="text-[#D4AF37]">
              começa aqui
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            A plataforma completa para sua preparação em concursos públicos e vestibulares. 
            Estude com método, acompanhe seu progresso e alcance seus objetivos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/register"
              className="px-8 py-4 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-lg font-bold rounded-xl shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              🚀 Começar Agora Grátis
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-200"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Conteúdo Completo
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Módulos organizados por matéria e nível de dificuldade
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Acompanhamento
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitore seu progresso e melhore continuamente
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Cronograma
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Planeje seus estudos de forma eficiente
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Concurso PRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
