import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ModuleDetailClient from './ModuleDetailClient'

// Força renderização dinâmica para sempre buscar dados atualizados
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Desabilita cache

interface Material {
  id: string
  title: string
  description: string | null
  type: string
  file_url: string
  file_size: string | null
  pages: number | null
  is_free: boolean
  display_order: number
}

export default async function ModuleDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const slug = params.slug

  // Verificar se usuário tem acesso premium
  if (!profile?.is_premium) {
    redirect('/subscription')
  }

  // Buscar módulo do banco de dados
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', slug)
    .single()

  // Se não encontrar no banco, usar dados mockados
  const mockModules: Record<string, { name: string; icon: string; materials: Array<{ id: string; title: string; type: string; url: string; size?: string; pages?: number }> }> = {
    'policiais': {
      name: 'Carreiras Policiais',
      icon: '🛡️',
      materials: [
        { id: '1', title: 'Direito Constitucional - Parte 1', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.5 MB', pages: 45 },
        { id: '2', title: 'Direito Penal - Introdução', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.8 MB', pages: 32 },
        { id: '3', title: 'Direito Administrativo', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '3.2 MB', pages: 58 },
        { id: '4', title: 'Legislação Específica', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.5 MB', pages: 28 },
      ]
    },
    'militares': {
      name: 'Carreiras Militares',
      icon: '⭐',
      materials: [
        { id: '1', title: 'Matemática Básica', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.1 MB', pages: 40 },
        { id: '2', title: 'Português para Concursos', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.9 MB', pages: 35 },
        { id: '3', title: 'História do Brasil', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.8 MB', pages: 52 },
      ]
    },
    'fiscais': {
      name: 'Concursos Fiscais',
      icon: '💼',
      materials: [
        { id: '1', title: 'Direito Tributário', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '3.5 MB', pages: 65 },
        { id: '2', title: 'Contabilidade Geral', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.7 MB', pages: 48 },
        { id: '3', title: 'Legislação Tributária', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.2 MB', pages: 42 },
      ]
    },
    'juridicas': {
      name: 'Carreiras Jurídicas',
      icon: '⚖️',
      materials: [
        { id: '1', title: 'Direito Civil - Parte Geral', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '4.1 MB', pages: 72 },
        { id: '2', title: 'Direito Processual Civil', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '3.8 MB', pages: 68 },
      ]
    },
    'bancarias': {
      name: 'Carreiras Bancárias',
      icon: '🏦',
      materials: [
        { id: '1', title: 'Conhecimentos Bancários', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.3 MB', pages: 44 },
        { id: '2', title: 'Matemática Financeira', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.7 MB', pages: 31 },
      ]
    },
    'educacao': {
      name: 'Educação',
      icon: '👨‍🏫',
      materials: [
        { id: '1', title: 'Didática e Pedagogia', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.0 MB', pages: 38 },
        { id: '2', title: 'Legislação Educacional', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.6 MB', pages: 29 },
      ]
    },
    'saude': {
      name: 'Saúde',
      icon: '⚕️',
      materials: [
        { id: '1', title: 'SUS - Sistema Único de Saúde', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.4 MB', pages: 46 },
        { id: '2', title: 'Legislação em Saúde', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.8 MB', pages: 33 },
      ]
    },
    'administrativas': {
      name: 'Administrativas',
      icon: '📋',
      materials: [
        { id: '1', title: 'Direito Administrativo', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '3.0 MB', pages: 55 },
        { id: '2', title: 'Administração Pública', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.5 MB', pages: 47 },
      ]
    },
    'ti': {
      name: 'Tecnologia da Informação',
      icon: '💻',
      materials: [
        { id: '1', title: 'Fundamentos de TI', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.8 MB', pages: 51 },
        { id: '2', title: 'Segurança da Informação', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.2 MB', pages: 41 },
      ]
    },
    'engenharia': {
      name: 'Engenharia',
      icon: '⚙️',
      materials: [
        { id: '1', title: 'Matemática para Engenharia', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '3.3 MB', pages: 60 },
        { id: '2', title: 'Física Aplicada', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.9 MB', pages: 54 },
      ]
    },
    'controle': {
      name: 'Controle e Fiscalização',
      icon: '🔍',
      materials: [
        { id: '1', title: 'Auditoria Governamental', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.6 MB', pages: 49 },
        { id: '2', title: 'Controle Interno', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.1 MB', pages: 39 },
      ]
    },
    'correios': {
      name: 'Correios',
      icon: '📮',
      materials: [
        { id: '1', title: 'Conhecimentos Gerais dos Correios', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.9 MB', pages: 36 },
        { id: '2', title: 'Atendimento ao Público', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.4 MB', pages: 26 },
      ]
    },
    'legislativa': {
      name: 'Legislativa',
      icon: '🏛️',
      materials: [
        { id: '1', title: 'Processo Legislativo', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.3 MB', pages: 43 },
        { id: '2', title: 'Regimento Interno', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.7 MB', pages: 32 },
      ]
    },
    'enem': {
      name: 'ENEM/Vestibulares',
      icon: '🎓',
      materials: [
        { id: '1', title: 'Redação - Técnicas e Dicas', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.0 MB', pages: 37 },
        { id: '2', title: 'Matemática ENEM', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '2.5 MB', pages: 46 },
        { id: '3', title: 'Linguagens e Códigos', type: 'pdf', url: '/pdfs/exemplo.pdf', size: '1.8 MB', pages: 34 },
      ]
    }
  }

  // Buscar materiais do banco de dados
  let materials: Material[] = []
  let moduleToDisplay = module

  if (module && !moduleError) {
    // Módulo encontrado no banco, buscar materiais
    const { data: dbMaterials } = await supabase
      .from('materials')
      .select('*')
      .eq('module_id', module.id)
      .order('display_order', { ascending: true })

    materials = dbMaterials || []
  } else {
    // Usar dados mockados
    const mockModule = mockModules[slug]
    if (mockModule) {
      moduleToDisplay = {
        id: slug,
        slug: slug,
        title: mockModule.name,
        description: '',
        icon: mockModule.icon,
        is_premium: true
      }
      
      // Converter mock materials para o formato correto
      materials = mockModule.materials.map(m => ({
        id: m.id,
        title: m.title,
        description: null,
        type: m.type,
        file_url: m.url,
        file_size: m.size || null,
        pages: m.pages || null,
        is_free: false,
        display_order: 0
      }))
    }
  }

  if (!moduleToDisplay) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">❌</span>
        <h2 className="text-2xl text-white font-bold mb-2">Módulo não encontrado</h2>
        <p className="text-gray-400 mb-6">O módulo que você está procurando não existe.</p>
        <Link
          href="/modules"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
        >
          <span>←</span>
          <span>Voltar para Módulos</span>
        </Link>
      </div>
    )
  }

  return (
    <ModuleDetailClient
      module={{
        title: moduleToDisplay.title,
        icon: moduleToDisplay.icon
      }}
      materials={materials}
    />
  )
}
