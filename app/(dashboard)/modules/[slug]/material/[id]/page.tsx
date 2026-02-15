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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href={`/modules/${slug}`}
                className="text-gray-400 hover:text-[#D4AF37] transition flex-shrink-0"
                title="Voltar para o módulo"
              >
                <span className="text-2xl">←</span>
              </Link>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg flex-shrink-0">{material.modules.icon}</span>
                  <span className="text-gray-400 text-sm truncate">
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
                <span className="hidden sm:inline-flex text-xs text-gray-500 items-center gap-1">
                  <span>📦</span>
                  {material.file_size}
                </span>
              )}
              {material.pages && (
                <span className="hidden sm:inline-flex text-xs text-gray-500 items-center gap-1">
                  <span>📄</span>
                  {material.pages} pág.
                </span>
              )}
              
              <a
                href={material.file_url}
                download
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-sm font-semibold rounded transition"
              >
                <span className="hidden sm:inline">⬇️ Download</span>
                <span className="sm:hidden">⬇️</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Viewer */}
      <main className="flex-1 flex">
        <MaterialViewer material={material} />
      </main>

      {/* Sidebar com outros materiais (opcional) */}
      {otherMaterials && otherMaterials.length > 1 && (
        <aside className="hidden lg:block fixed right-0 top-16 bottom-0 w-64 bg-[#1a1a1a] border-l border-gray-800 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3 text-sm">
              Outros materiais
            </h3>
            <div className="space-y-2">
              {otherMaterials.map((mat) => (
                <Link
                  key={mat.id}
                  href={`/modules/${slug}/material/${mat.id}`}
                  className={`block p-2 rounded text-sm transition ${
                    mat.id === id
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                      : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {mat.type === 'pdf' ? '📄' : mat.type === 'video' ? '🎥' : '📎'}
                    </span>
                    <span className="truncate">{mat.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
