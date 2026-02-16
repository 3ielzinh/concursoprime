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
  const [currentPath, setCurrentPath] = useState<string[]>([]) // Para navegação hierárquica
  
  // Estrutura hierárquica de pastas
  interface FolderItem {
    type: 'folder' | 'file'
    name: string
    fullPath: string
    material?: Material
    count?: number
  }

  // Obter itens do diretório atual
  const getCurrentDirectoryItems = (): FolderItem[] => {
    const currentPathStr = currentPath.join('/')
    const items: FolderItem[] = []
    const seenFolders = new Set<string>()
    const seenFiles = new Set<string>()

    materials.forEach(material => {
      const titleParts = material.title.split('/')
      
      // Se o material está no diretório atual
      if (currentPath.length === 0 && titleParts.length === 1) {
        // Arquivo na raiz
        if (!seenFiles.has(material.title)) {
          items.push({
            type: 'file',
            name: material.title,
            fullPath: material.title,
            material: material
          })
          seenFiles.add(material.title)
        }
      } else if (currentPath.length > 0) {
        // Verificar se o arquivo está no caminho atual
        const materialPath = titleParts.slice(0, -1).join('/')
        const fileName = titleParts[titleParts.length - 1]
        
        if (materialPath === currentPathStr) {
          // Arquivo no diretório atual
          if (!seenFiles.has(material.title)) {
            items.push({
              type: 'file',
              name: fileName,
              fullPath: material.title,
              material: { ...material, title: fileName }
            })
            seenFiles.add(material.title)
          }
        }
      }
      
      // Procurar subpastas
      if (titleParts.length > currentPath.length + 1) {
        const nextFolderIndex = currentPath.length
        const pathUpToNextFolder = titleParts.slice(0, nextFolderIndex + 1).join('/')
        
        // Verificar se está no caminho correto
        let isInCurrentPath = true
        for (let i = 0; i < currentPath.length; i++) {
          if (titleParts[i] !== currentPath[i]) {
            isInCurrentPath = false
            break
          }
        }
        
        if (isInCurrentPath && !seenFolders.has(pathUpToNextFolder)) {
          const folderName = titleParts[nextFolderIndex]
          // Contar quantos arquivos tem nessa pasta (recursivamente)
          const count = materials.filter(m => m.title.startsWith(pathUpToNextFolder + '/')).length
          
          items.push({
            type: 'folder',
            name: folderName,
            fullPath: pathUpToNextFolder,
            count: count
          })
          seenFolders.add(pathUpToNextFolder)
        }
      }
    })

    return items.sort((a, b) => {
      // Pastas primeiro, depois arquivos
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }

  const handleFolderClick = (item: FolderItem) => {
    if (item.type === 'folder') {
      // Navegar para dentro da pasta
      const newPath = item.fullPath.split('/')
      setCurrentPath(newPath)
    }
  }

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentPath([])
    } else {
      setCurrentPath(currentPath.slice(0, index + 1))
    }
  }

  const currentItems = getCurrentDirectoryItems()

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'video': return '🎥'
      case 'text': return '📝'
      default: return '📎'
    }
  }

  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
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
        <div className="mb-6 flex justify-end items-center">
          <div className="inline-flex bg-[#1a1a1a] border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => {
                setViewMode('folders')
                setCurrentPath([]) // Reset para raiz ao voltar para modo pastas
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'folders'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📁 Por Pastas
            </button>
            <button
              onClick={() => setViewMode('grid')}
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
        // Visualização Hierárquica por Pastas
        <>
          {/* Breadcrumb de navegação completo - sempre visível */}
          <div className="mb-6 bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="text-gray-500">📍 Localização:</span>
              <button
                onClick={() => handleBreadcrumbClick(-1)}
                className={`transition font-medium ${
                  currentPath.length === 0 
                    ? 'text-gray-400 cursor-default' 
                    : 'text-gray-400 hover:text-[#D4AF37]'
                }`}
                disabled={currentPath.length === 0}
              >
                Módulo
              </button>
              <span className="text-gray-600">›</span>
              <button
                onClick={() => handleBreadcrumbClick(-1)}
                className={`flex items-center gap-1 transition ${
                  currentPath.length === 0 
                    ? 'text-[#D4AF37] font-semibold cursor-default' 
                    : 'text-white hover:text-[#D4AF37] font-medium'
                }`}
                disabled={currentPath.length === 0}
              >
                <span>{module.icon}</span>
                <span>{module.title}</span>
              </button>
              
              {currentPath.length > 0 && (
                <>
                  {currentPath.map((folder, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-600">›</span>
                      <button
                        onClick={() => handleBreadcrumbClick(index)}
                        className={`transition flex items-center gap-1 ${
                          index === currentPath.length - 1
                            ? 'text-[#D4AF37] font-semibold'
                            : 'text-gray-300 hover:text-[#D4AF37]'
                        }`}
                      >
                        <span>📁</span>
                        <span>{folder}</span>
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Botão Voltar */}
          {currentPath.length > 0 && (
            <div className="mb-4">
              <button
                onClick={handleBackClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#D4AF37]/50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Voltar para {currentPath.length > 1 ? currentPath[currentPath.length - 2] : module.title}</span>
              </button>
            </div>
          )}

          {/* Título da seção atual */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {currentPath.length > 0 ? (
                <>
                  <span>📂</span>
                  <span>{currentPath[currentPath.length - 1]}</span>
                </>
              ) : (
                <>
                  <span>{module.icon}</span>
                  <span>Raiz do Módulo</span>
                </>
              )}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {currentItems.length === 0 
                ? 'Nenhum item nesta pasta' 
                : `${currentItems.filter(i => i.type === 'folder').length} pasta${currentItems.filter(i => i.type === 'folder').length !== 1 ? 's' : ''} e ${currentItems.filter(i => i.type === 'file').length} arquivo${currentItems.filter(i => i.type === 'file').length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* Grade de pastas e arquivos do diretório atual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.map((item, index) => (
              item.type === 'folder' ? (
                // Card de Pasta
                <button
                  key={`folder-${index}`}
                  onClick={() => handleFolderClick(item)}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden flex flex-col hover:border-[#D4AF37]/50 hover:bg-[#252525] transition p-4 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl group-hover:scale-110 transition">📁</span>
                    <span className="text-[#D4AF37] text-xs font-semibold px-2 py-1 bg-[#D4AF37]/10 rounded">
                      {item.count}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-[#D4AF37] transition">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {item.count} item{item.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>
              ) : (
                // Card de Arquivo
                <div 
                  key={`file-${index}`}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-[#D4AF37]/50 transition group flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl flex-shrink-0">
                      {getFileIcon(item.material?.type || '')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#D4AF37] transition line-clamp-2">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-xs text-gray-500 mb-3">
                    {item.material?.file_size && (
                      <span className="flex items-center gap-1">
                        <span>📦</span>
                        {item.material.file_size}
                      </span>
                    )}
                    {item.material?.pages && (
                      <span className="flex items-center gap-1">
                        <span>📄</span>
                        {item.material.pages} páginas
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <Link
                      href={`/modules/${moduleSlug}/material/${item.material?.id}`}
                      className="w-full px-3 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition text-xs text-center"
                    >
                      📖 Abrir
                    </Link>
                    <a
                      href={item.material?.file_url}
                      download
                      className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition text-xs text-center"
                    >
                      ⬇️ Baixar
                    </a>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Mensagem quando pasta vazia */}
          {currentItems.length === 0 && (
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg mb-2">
                📂 Pasta vazia
              </p>
              <p className="text-gray-500 text-sm">
                Não há arquivos ou subpastas neste diretório
              </p>
            </div>
          )}
        </>
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
