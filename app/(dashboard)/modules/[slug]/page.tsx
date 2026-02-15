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
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { slug } = await params
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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

  // Se módulo não existe, retornar erro 404
  if (!module || moduleError) {
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

  // Buscar materiais do banco de dados
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('module_id', module.id)
    .order('display_order', { ascending: true })

  return (
    <ModuleDetailClient
      module={{
        title: module.title,
        icon: module.icon
      }}
      moduleSlug={slug}
      materials={(materials || []) as Material[]}
    />
  )
}
