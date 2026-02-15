import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ModulesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const modules = [
    {
      title: 'CARREIRAS POLICIAIS',
      description: 'PF, PRF, PC, PM, Perito, Delegado e mais',
      icon: '🛡️',
      link: '/modules/policiais'
    },
    {
      title: 'CARREIRAS MILITARES',
      description: 'Exército, Marinha, Aeronáutica, Bombeiros',
      icon: '⭐',
      link: '/modules/militares'
    },
    {
      title: 'CARREIRAS FISCAIS',
      description: 'Receita Federal, SEFAZ, ISS, TCU, CGU',
      icon: '💰',
      link: '/modules/fiscais'
    },
    {
      title: 'CARREIRAS JURÍDICAS',
      description: 'Magistratura, MP, Defensoria, AGU, TRF, TJ',
      icon: '⚖️',
      link: '/modules/juridicas'
    },
    {
      title: 'CARREIRAS BANCÁRIAS',
      description: 'BB, Caixa, Banco Central, BNDES, Privados',
      icon: '🏦',
      link: '/modules/bancarias'
    },
    {
      title: 'CARREIRAS EM EDUCAÇÃO',
      description: 'Professor, Pedagogo, Coordenador, IFES',
      icon: '📚',
      link: '/modules/educacao'
    },
    {
      title: 'CARREIRAS EM SAÚDE',
      description: 'Médico, Enfermeiro, Farmacêutico, SUS',
      icon: '🏥',
      link: '/modules/saude'
    },
    {
      title: 'CARREIRAS ADMINISTRATIVAS',
      description: 'Analista, Técnico, Assistente Administrativo',
      icon: '📋',
      link: '/modules/administrativas'
    },
    {
      title: 'CARREIRAS TI',
      description: 'Analista de Sistemas, Desenvolvedor, Suporte',
      icon: '💻',
      link: '/modules/ti'
    },
    {
      title: 'CARREIRAS EM ENGENHARIA',
      description: 'Civil, Elétrica, Mecânica, Ambiental',
      icon: '⚙️',
      link: '/modules/engenharia'
    },
    {
      title: 'CONTROLE E FISCALIZAÇÃO',
      description: 'Auditor, CGU, TCU, INSS, IBAMA, ANVISA',
      icon: '🔍',
      link: '/modules/controle'
    },
    {
      title: 'CORREIOS E LOGÍSTICA',
      description: 'Carteiro, Agente, Operador, Atendente',
      icon: '📦',
      link: '/modules/correios'
    },
    {
      title: 'ÁREA LEGISLATIVA',
      description: 'Câmara, Senado, Assembleias, Consultor',
      icon: '🏛️',
      link: '/modules/legislativa'
    },
    {
      title: 'ENEM E VESTIBULARES',
      description: 'ENEM, FUVEST, UNICAMP, ITA, IME, AFA',
      icon: '🎓',
      link: '/modules/enem'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2">Concurseiro Prime</h2>
          <p className="text-gray-400 mb-4">O material mais completo e acessível para concurseiros</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-4">
            <span>📝 Apostilas</span>
            <span>•</span>
            <span>🎥 Videoaulas</span>
            <span>•</span>
            <span>📊 Simulados</span>
            <span>•</span>
            <span>❓ Questões</span>
            <span>•</span>
            <span>📚 Mapas Mentais</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <span className="text-xl">👥</span>
            <span className="font-semibold">12.467 pessoas estudando agora</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Escolha sua área de interesse abaixo:</h2>
      </div>

      {!profile?.is_premium && (
        <div className="mb-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white">
                Desbloqueie todos os módulos
              </h3>
              <p className="text-sm text-gray-400">
                Assine o Plano PRO e tenha acesso completo
              </p>
            </div>
            <Link
              href="/subscription"
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
            >
              Assinar PRO
            </Link>
          </div>
        </div>
      )}

      {/* Grid de Cards de Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {modules.map((module, index) => (
          <div
            key={index}
            className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-800 hover:border-[#D4AF37]/50 transition group"
          >
            {/* Área de imagem/gradiente no topo */}
            <div className="relative h-24 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" />
              <h3 className="relative text-lg font-bold text-white text-center px-3 uppercase tracking-wide">
                {module.title}
              </h3>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-4">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-2xl">{module.icon}</span>
                <p className="text-gray-400 text-xs leading-relaxed flex-1">
                  {module.description}
                </p>
              </div>

              <Link
                href={profile?.is_premium ? module.link : '/subscription'}
                className="block w-full text-center py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2 group-hover:scale-[1.02] transform"
              >
                <span>Acesse Aqui</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              {!profile?.is_premium && (
                <p className="text-center text-xs text-gray-500 mt-1.5">
                  Requer plano PRO
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
