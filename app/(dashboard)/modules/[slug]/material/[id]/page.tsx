import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MaterialViewer from './MaterialViewer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MaterialViewPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const supabase = await createClient()
  const { slug, id } = await params
  
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

  // Buscar material e módulo
  const { data: material, error } = await supabase
    .from('materials')
    .select(`
      *,
      modules:module_id (
        slug,
        title,
        icon
      )
    `)
    .eq('id', id)
    .single()

  if (error || !material) {
    notFound()
  }

  // Verificar se o material pertence ao módulo correto
  if (material.modules.slug !== slug) {
    notFound()
  }

  // Buscar outros materiais do mesmo módulo
  const { data: otherMaterials } = await supabase
    .from('materials')
    .select('id, title, type')
    .eq('module_id', material.module_id)
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar com outros materiais */}
      {otherMaterials && otherMaterials.length > 1 && (
        <aside className="hidden lg:flex flex-col w-72 bg-[#1a1a1a] border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <Link
              href={`/modules/${slug}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition text-sm"
            >
              <span>←</span>
              <span>Voltar ao módulo</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span>📚</span>
              <span>Materiais do Módulo</span>
            </h3>
            <div className="space-y-1">
              {otherMaterials.map((mat) => (
                <Link
                  key={mat.id}
                  href={`/modules/${slug}/material/${mat.id}`}
                  className={`block p-3 rounded-lg text-sm transition group ${
                    mat.id === id
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30'
                      : 'text-gray-400 hover:bg-[#252525] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg flex-shrink-0">
                      {mat.type === 'pdf' ? '📄' : mat.type === 'video' ? '🎥' : '📎'}
                    </span>
                    <span className="truncate flex-1">{mat.title}</span>
                    {mat.id === id && (
                      <span className="text-xs bg-[#D4AF37] text-black px-2 py-0.5 rounded font-medium">
                        Atual
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center">
              {otherMaterials.length} {otherMaterials.length === 1 ? 'material' : 'materiais'} disponíveis
            </div>
          </div>
        </aside>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-10 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Link
                  href={`/modules/${slug}`}
                  className="lg:hidden text-gray-400 hover:text-[#D4AF37] transition flex-shrink-0"
                  title="Voltar para o módulo"
                >
                  <span className="text-2xl">←</span>
                </Link>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg flex-shrink-0">{material.modules.icon}</span>
                    <span className="text-gray-400 text-xs sm:text-sm truncate">
                      {material.modules.title}
                    </span>
                  </div>
                  <h1 className="text-white font-semibold text-sm sm:text-base truncate">
                    {material.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {material.file_size && (
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#252525] rounded text-xs text-gray-400">
                    <span>📦</span>
                    <span>{material.file_size}</span>
                  </div>
                )}
                {material.pages && (
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#252525] rounded text-xs text-gray-400">
                    <span>📄</span>
                    <span>{material.pages} pág.</span>
                  </div>
                )}
                
                <a
                  href={material.file_url}
                  download
                  className="px-3 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-xs sm:text-sm font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Viewer */}
        <main className="flex-1">
          <MaterialViewer material={material} />
        </main>
      </div>
    </div>
  )
}
