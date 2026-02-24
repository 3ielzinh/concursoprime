'use client'

import { useState } from 'react'

export default function SimuladosPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleOpenSimulados = () => {
    window.open('https://www.simulado.profdaviconcursos.com.br/', '_blank', 'noopener,noreferrer')
  }

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const disciplinas = [
    {
      nome: 'Conhecimentos Pedagógicos',
      total: 924,
      icon: '📚',
      subtopicos: [
        { nome: 'Alfabetização e Letramento', qtd: 100 },
        { nome: 'Aspectos Psicológicos da Educação', qtd: 100 },
        { nome: 'Avaliação Educacional', qtd: 100 },
        { nome: 'BNCC', qtd: 100 },
        { nome: 'Educação Especial – Leis, Tratados e Normas Especiais', qtd: 100 },
        { nome: 'História da Educação Brasileira', qtd: 100 },
        { nome: 'LDB – Lei de Diretrizes e Bases da Educação', qtd: 160 },
        { nome: 'Planejamento Educacional', qtd: 64 },
        { nome: 'Tendências Pedagógicas', qtd: 100 }
      ]
    },
    {
      nome: 'Direito',
      total: 58060,
      icon: '⚖️',
      subtopicos: [
        { nome: 'Direito Administrativo', qtd: 6206 },
        { nome: 'Direito Civil', qtd: 5499 },
        { nome: 'Direito Comercial', qtd: 1702 },
        { nome: 'Direito Constitucional', qtd: 7235 },
        { nome: 'Direito em Geral', qtd: 15382 },
        { nome: 'Direito Penal', qtd: 5187 },
        { nome: 'Direito Processual Civil', qtd: 5888 },
        { nome: 'Direito Processual Penal', qtd: 5762 },
        { nome: 'Direito Trabalhista', qtd: 2890 },
        { nome: 'Tributário', qtd: 2309 }
      ]
    },
    {
      nome: 'Diversos',
      total: 15370,
      icon: '🔍',
      subtopicos: [
        { nome: 'Administração', qtd: 4488 },
        { nome: 'Atualidades', qtd: 392 },
        { nome: 'Biologia', qtd: 100 },
        { nome: 'Conhecimentos Básicos', qtd: 562 },
        { nome: 'Conhecimentos Pedagógicos', qtd: 645 },
        { nome: 'Contabilidade', qtd: 6702 },
        { nome: 'Economia', qtd: 1666 },
        { nome: 'Física', qtd: 49 },
        { nome: 'Geografia', qtd: 257 },
        { nome: 'História', qtd: 218 },
        { nome: 'Inglês', qtd: 207 },
        { nome: 'Legislação do SUS', qtd: 223 },
        { nome: 'Química', qtd: 68 }
      ]
    },
    {
      nome: 'Informática',
      total: 16561,
      icon: '💻',
      subtopicos: [
        { nome: 'Informática Diversos', qtd: 16561 }
      ]
    },
    {
      nome: 'Matemática',
      total: 13684,
      icon: '🔢',
      subtopicos: [
        { nome: 'Matemática Diversos', qtd: 3642 },
        { nome: 'Matemática Elementar', qtd: 8402 },
        { nome: 'Raciocínio Lógico', qtd: 1433 }
      ]
    },
    {
      nome: 'Português',
      total: 15487,
      icon: '📖',
      subtopicos: [
        { nome: 'Concordância e Regência', qtd: 1068 },
        { nome: 'Fonética e Fonologia', qtd: 203 },
        { nome: 'Interpretação e Linguagem', qtd: 330 },
        { nome: 'Morfologia', qtd: 1986 },
        { nome: 'Ortografia e Pontuação', qtd: 1500 },
        { nome: 'Português em Geral', qtd: 9589 },
        { nome: 'Semântica', qtd: 422 },
        { nome: 'Sintaxe', qtd: 389 }
      ]
    }
  ]

  const features = [
    {
      icon: '✏️',
      title: 'Questões Reais',
      description: 'Simulados baseados em concursos'
    },
    {
      icon: '📊',
      title: 'Resultados Detalhados',
      description: 'Análise de desempenho completa'
    },
    {
      icon: '🎯',
      title: 'Treino Focado',
      description: 'Pratique por matéria ou cargo'
    },
    {
      icon: '⏱️',
      title: 'Cronômetro Integrado',
      description: 'Simule condições de prova'
    }
  ]

  return (
    <div className="h-full overflow-y-auto py-4">
      <div className="w-full max-w-6xl px-6 mx-auto">{/* Header Compacto */}
        <div className="mb-6 text-center">
          <div className="inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-3xl shadow-lg shadow-[#D4AF37]/20">
              📝
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Simulados Online
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Pratique com questões de concursos anteriores e teste seus conhecimentos
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
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Plataforma Especializada
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Prof. Davi Concursos
              </h2>
              
              <p className="text-gray-300 text-sm sm:text-base mb-5 max-w-2xl mx-auto">
                Milhares de questões organizadas. Prepare-se com simulados realistas!
              </p>
              
              <button
                onClick={handleOpenSimulados}
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-base rounded-lg transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-105 transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>Acessar Simulados</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <p className="text-xs text-gray-500 mt-3">
                🔗 Você será redirecionado para a plataforma externa
              </p>
            </div>
          </div>

          {/* Features Grid Compacto */}
          <div className="p-6 sm:p-8 border-b border-gray-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-300 text-center"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="text-white text-xs sm:text-sm font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview das Disciplinas */}
          <div className="p-6 sm:p-8 border-b border-gray-800">
            <div className="mb-4">
              <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Banco de Questões
              </h3>
              <p className="text-gray-400 text-xs">
                Explore mais de 120 mil questões organizadas por disciplina
              </p>
            </div>

            <div className="space-y-2">
              {disciplinas.map((disciplina, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden hover:border-[#D4AF37]/20 transition-all"
                >
                  {/* Header da Categoria */}
                  <button
                    onClick={() => toggleCategory(disciplina.nome)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{disciplina.icon}</span>
                      <div className="text-left">
                        <h4 className="text-white font-semibold text-sm">
                          {disciplina.nome}
                        </h4>
                        <p className="text-gray-500 text-xs">
                          {disciplina.subtopicos.length} subtópicos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[#D4AF37] text-xs font-bold">
                        {disciplina.total.toLocaleString('pt-BR')}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedCategory === disciplina.nome ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Subtópicos Expandíveis */}
                  {expandedCategory === disciplina.nome && (
                    <div className="px-4 pb-3 pt-1 border-t border-gray-800 bg-[#050505]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {disciplina.subtopicos.map((subtopico, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex items-center justify-between py-2 px-3 bg-[#0a0a0a] rounded border border-gray-800/50"
                          >
                            <span className="text-gray-300 text-xs">
                              {subtopico.nome}
                            </span>
                            <span className="text-[#D4AF37] text-xs font-semibold">
                              {subtopico.qtd}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-[#D4AF37]/5 to-transparent rounded-lg border border-[#D4AF37]/20">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong className="text-white">Total: 120.086 questões</strong> disponíveis para prática
                </span>
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    Dica Importante
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Faça simulados regularmente para identificar pontos fracos e acompanhar sua evolução. 
                    A prática consistente é fundamental para o sucesso!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 Integre os simulados ao seu cronograma de estudos para melhores resultados
          </p>
        </div>
      </div>
    </div>
  )
}
