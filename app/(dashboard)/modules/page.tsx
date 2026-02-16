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
      link: '/modules/policiais',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80'
    },
    {
      title: 'CARREIRAS MILITARES',
      description: 'Exército, Marinha, Aeronáutica, Bombeiros',
      icon: '⭐',
      link: '/modules/militares',
      image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&q=80'
    },
    {
      title: 'CARREIRAS FISCAIS',
      description: 'Receita Federal, SEFAZ, ISS, TCU, CGU',
      icon: '💰',
      link: '/modules/fiscais',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
    },
    {
      title: 'CARREIRAS JURÍDICAS',
      description: 'Magistratura, MP, Defensoria, AGU, TRF, TJ',
      icon: '⚖️',
      link: '/modules/juridicas',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80'
    },
    {
      title: 'CARREIRAS BANCÁRIAS',
      description: 'BB, Caixa, Banco Central, BNDES, Privados',
      icon: '🏦',
      link: '/modules/bancarias',
      image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80'
    },
    {
      title: 'CARREIRAS EM EDUCAÇÃO',
      description: 'Professor, Pedagogo, Coordenador, IFES',
      icon: '📚',
      link: '/modules/educacao',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    },
    {
      title: 'CARREIRAS EM SAÚDE',
      description: 'Médico, Enfermeiro, Farmacêutico, SUS',
      icon: '🏥',
      link: '/modules/saude',
      image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80'
    },
    {
      title: 'CARREIRAS ADMINISTRATIVAS',
      description: 'Analista, Técnico, Assistente Administrativo',
      icon: '📋',
      link: '/modules/administrativas',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    {
      title: 'CARREIRAS TI',
      description: 'Analista de Sistemas, Desenvolvedor, Suporte',
      icon: '💻',
      link: '/modules/ti',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
    },
    {
      title: 'CARREIRAS EM ENGENHARIA',
      description: 'Civil, Elétrica, Mecânica, Ambiental',
      icon: '⚙️',
      link: '/modules/engenharia',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80'
    },
    {
      title: 'CONTROLE E FISCALIZAÇÃO',
      description: 'Auditor, CGU, TCU, INSS, IBAMA, ANVISA',
      icon: '🔍',
      link: '/modules/controle',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'
    },
    {
      title: 'CORREIOS E LOGÍSTICA',
      description: 'Carteiro, Agente, Operador, Atendente',
      icon: '📦',
      link: '/modules/correios',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80'
    },
    {
      title: 'ÁREA LEGISLATIVA',
      description: 'Câmara, Senado, Assembleias, Consultor',
      icon: '🏛️',
      link: '/modules/legislativa',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'
    },
    {
      title: 'ENEM E VESTIBULARES',
      description: 'ENEM, FUVEST, UNICAMP, ITA, IME, AFA',
      icon: '🎓',
      link: '/modules/enem',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
    }
  ]

  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Módulos de Estudo</h1>
        <p className="text-gray-400">Escolha sua área de interesse e comece seus estudos</p>
      </div>

      {!profile?.is_premium && (
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-white text-xl mb-2">
                Desbloqueie Acesso Completo
              </h3>
              <p className="text-gray-400">
                Assine o Plano PRO e tenha acesso ilimitado a todos os módulos e materiais
              </p>
            </div>
            <Link
              href="/subscription"
              className="px-6 py-3 bg-white hover:bg-gray-100 text-[#0a0a0a] font-bold rounded-lg transition whitespace-nowrap ml-4"
            >
              Assinar Agora
            </Link>
          </div>
        </div>
      )}

      {/* Grid de Cards de Módulos - 5 por linha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {modules.map((module, index) => (
          <Link
            key={index}
            href={profile?.is_premium ? module.link : '/subscription'}
            className="group bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-white/20 transition-all overflow-hidden hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1"
          >
            {/* Header com imagem de fundo desfocada */}
            <div className="relative h-48 overflow-hidden">
              {/* Imagem de fundo com blur */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${module.image})` }}
              />
              <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-gray-900/70 to-[#1a1a1a]/85" />
              
              {/* Conteúdo sobre a imagem */}
              <div className="relative h-full flex items-center justify-center p-6">
                <h3 className="text-lg font-bold text-white text-center uppercase tracking-wide leading-tight drop-shadow-lg">
                  {module.title}
                </h3>
              </div>
              
              {/* Badge PRO */}
              <div className="absolute top-3 right-3">
                {!profile?.is_premium && (
                  <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-md text-xs font-semibold text-white border border-white/20">
                    PRO
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-5">
              <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2 min-h-[40px]">
                {module.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <span className={`text-sm font-semibold ${profile?.is_premium ? 'text-white' : 'text-gray-500'}`}>
                  {profile?.is_premium ? 'Acessar Módulo' : 'Bloqueado'}
                </span>
                <svg className={`w-5 h-5 ${profile?.is_premium ? 'text-white' : 'text-gray-600'} group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
