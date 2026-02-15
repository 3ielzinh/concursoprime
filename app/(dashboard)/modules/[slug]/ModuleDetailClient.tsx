'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Material {
  id: string
  title: string
  description: string | null
  type: string
  file_url: string
  file_size: string | null
  pages: number | null
}

interface Module {
  title: string
  icon: string
}

interface Props {
  module: Module
  moduleSlug: string
  materials: Material[]
}

export default function ModuleDetailClient({ module, moduleSlug, materials }: Props) {
  const [viewMode, setViewMode] = useState<'folders' | 'grid'>('folders')
  
  // Organizar materiais por estrutura de pastas
  const organizeByFolders = () => {
    const folderMap = new Map<string, Material[]>()
    
    materials.forEach(material => {
      // Extrair pasta do título (ex: "pasta1/pasta2/arquivo.pdf" -> "pasta1/pasta2")
      const titleParts = material.title.split('/')
      let folderPath = ''
      
      if (titleParts.length > 1) {
        // Tem pasta no caminho
        folderPath = titleParts.slice(0, -1).join('/')
      } else {
        // Sem pasta, vai para raiz
        folderPath = ''
      }
      
      if (!folderMap.has(folderPath)) {
        folderMap.set(folderPath, [])
      }
      
      folderMap.get(folderPath)?.push({
        ...material,
        // Título simplificado (só o nome do arquivo)
        title: titleParts[titleParts.length - 1]
      })
    })
    
    return folderMap
  }

  const folderStructure = organizeByFolders()
  
  // Inicializar com todas as pastas expandidas
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    return new Set(Array.from(folderStructure.keys()))
  })

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const toggleAllFolders = () => {
    const allFolders = Array.from(folderStructure.keys())
    if (expandedFolders.size === allFolders.length) {
      // Se todas estão expandidas, colapsar todas
      setExpandedFolders(new Set())
    } else {
      // Expandir todas
      setExpandedFolders(new Set(allFolders))
    }
  }

  const handleViewModeChange = (mode: 'folders' | 'grid') => {
    setViewMode(mode)
    if (mode === 'folders') {
      // Expandir todas as pastas ao entrar no modo de pastas
      const allFolders = Array.from(folderStructure.keys())
      setExpandedFolders(new Set(allFolders))
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'video': return '🎥'
      case 'text': return '📝'
      default: return '📎'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/modules" 
          className="inline-flex items-center text-[#D4AF37] hover:text-[#FFD700] mb-4 transition"
        >
          <span className="mr-2">←</span>
          Voltar para Módulos
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{module.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{module.title}</h1>
        </div>
        <p className="text-gray-400">
          Explore todos os materiais disponíveis neste módulo
        </p>
      </div>

      {/* Toggle de visualização */}
      {materials.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          {viewMode === 'folders' && (
            <button
              onClick={toggleAllFolders}
              className="text-sm text-gray-400 hover:text-[#D4AF37] transition"
            >
              {expandedFolders.size === folderStructure.size ? '📁 Colapsar Todas' : '📂 Expandir Todas'}
            </button>
          )}
          
          <div className={`inline-flex bg-[#1a1a1a] border border-gray-800 rounded-lg p-1 ${viewMode !== 'folders' ? 'ml-auto' : ''}`}>
            <button
              onClick={() => handleViewModeChange('folders')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'folders'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📁 Por Pastas
            </button>
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⊞ Grade
            </button>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      {materials.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">
            📦 Nenhum material disponível ainda
          </p>
          <p className="text-gray-500 text-sm">
            Novos conteúdos serão adicionados em breve!
          </p>
        </div>
      ) : viewMode === 'folders' ? (
        // Visualização por Pastas
        <div className="space-y-4">
          {Array.from(folderStructure.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([folderPath, folderMaterials]) => {
              const isExpanded = expandedFolders.has(folderPath)
              
              return (
                <div 
                  key={folderPath}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden"
                >
                  {/* Header da Pasta */}
                  <button
                    onClick={() => toggleFolder(folderPath)}
                    className="w-full p-4 flex items-center justify-between hover:bg-[#252525] transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{isExpanded ? '📂' : '📁'}</span>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">
                          {folderPath ? folderPath : '📂 Arquivos na Raiz'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {folderMaterials.length} arquivo{folderMaterials.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xl">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Conteúdo da Pasta */}
                  {isExpanded && (
                    <div className="border-t border-gray-800 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {folderMaterials.map((material) => (
                          <div 
                            key={material.id}
                            className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 hover:border-[#D4AF37]/50 transition group flex flex-col"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <div className="text-2xl flex-shrink-0">
                                {getFileIcon(material.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-xs mb-1 group-hover:text-[#D4AF37] transition line-clamp-2">
                                  {material.title}
                                </h4>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 text-xs text-gray-500 mb-2">
                              {material.file_size && (
                                <span className="flex items-center gap-1">
                                  <span>📦</span>
                                  {material.file_size}
                                </span>
                              )}
                              {material.pages && (
                                <span className="flex items-center gap-1">
                                  <span>📄</span>
                                  {material.pages} páginas
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-auto flex flex-col gap-1.5">
                              <Link
                                href={`/modules/${moduleSlug}/material/${material.id}`}
                                className="w-full px-2 py-1.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded text-xs text-center"
                              >
                                📖 Abrir
                              </Link>
                              <a
                                href={material.file_url}
                                download
                                className="w-full px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded text-xs text-center"
                              >
                                ⬇️ Baixar
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      ) : (
        // Visualização em Grade (original)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {materials.map((material) => (
            <div 
              key={material.id}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-[#D4AF37]/50 transition group flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl flex-shrink-0">
                  {getFileIcon(material.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#D4AF37] transition line-clamp-2">
                    {material.title}
                  </h3>
                  
                </div>
              </div>
              
              <div className="flex flex-col gap-2 text-xs text-gray-500 mb-3">
                {material.file_size && (
                  <span className="flex items-center gap-1">
                    <span>📦</span>
                    {material.file_size}
                  </span>
                )}
                {material.pages && (
                  <span className="flex items-center gap-1">
                    <span>📄</span>
                    {material.pages} páginas
                  </span>
                )}
              </div>
              
              <div className="mt-auto flex flex-col gap-2">
                <Link
                  href={`/modules/${moduleSlug}/material/${material.id}`}
                  className="w-full px-3 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition text-xs text-center"
                >
                  📖 Abrir
                </Link>
                <a
                  href={material.file_url}
                  download
                  className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition text-xs text-center"
                >
                  ⬇️ Baixar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
