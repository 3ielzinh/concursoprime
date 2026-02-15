'use client'

import { useState, useEffect } from 'react'
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
  materials: Material[]
}

export default function ModuleDetailClient({ module, materials }: Props) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setIsLoading(true)
  }

  const handleCloseMaterial = () => {
    setSelectedMaterial(null)
    setIsLoading(false)
  }

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedMaterial) {
        handleCloseMaterial()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedMaterial])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedMaterial) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedMaterial])

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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                <button
                  onClick={() => handleSelectMaterial(material)}
                  className="w-full px-3 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition text-xs"
                >
                  Visualizar
                </button>
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition text-xs text-center"
                >
                  ⬇️ Baixar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de visualização */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm"
          onClick={handleCloseMaterial}
        >
          <div 
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-7xl w-full max-h-[95vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-3 sm:p-4 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="text-xl sm:text-2xl flex-shrink-0">{getFileIcon(selectedMaterial.type)}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm sm:text-base truncate">{selectedMaterial.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {selectedMaterial.file_size}
                    {selectedMaterial.pages && ` • ${selectedMaterial.pages} páginas`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={selectedMaterial.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs sm:text-sm rounded-lg transition inline-flex items-center gap-1"
                  title="Abrir em nova aba"
                >
                  <span>🔗</span>
                  <span className="hidden sm:inline">Nova Aba</span>
                </a>
                
                <button
                  onClick={handleCloseMaterial}
                  className="text-gray-400 hover:text-white text-2xl sm:text-3xl leading-none px-2"
                  title="Fechar"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="flex-1 overflow-hidden relative">
              {/* Indicador de carregamento */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="text-white text-center">
                    <div className="animate-spin text-4xl mb-2">⏳</div>
                    <p>Carregando...</p>
                  </div>
                </div>
              )}
              
              {selectedMaterial.type === 'pdf' ? (
                // Visualizador de PDF
                <iframe
                  src={selectedMaterial.file_url}
                  className="w-full h-full min-h-[60vh] sm:min-h-[70vh]"
                  title={selectedMaterial.title}
                  onLoad={() => setIsLoading(false)}
                  onLoadStart={() => setIsLoading(true)}
                />
              ) : selectedMaterial.type === 'video' ? (
                // Player de Vídeo
                <div className="p-2 sm:p-6 h-full flex items-center justify-center bg-black">
                  <video
                    src={selectedMaterial.file_url}
                    controls
                    controlsList="nodownload"
                    className="w-full h-auto max-h-full rounded-lg shadow-2xl"
                    preload="metadata"
                    onLoadStart={() => setIsLoading(true)}
                    onLoadedData={() => setIsLoading(false)}
                  >
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                </div>
              ) : (
                // Fallback para outros tipos
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="text-6xl mb-4">{getFileIcon(selectedMaterial.type)}</div>
                  <h4 className="text-white text-lg font-semibold mb-2">
                    Material Disponível para Download
                  </h4>
                  <p className="text-gray-400 mb-6 max-w-md">
                    Este tipo de material não possui visualização integrada. Faça o download para acessar o conteúdo.
                  </p>
                  
                  <a
                    href={selectedMaterial.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition inline-flex items-center gap-2"
                  >
                    <span>⬇️</span>
                    Baixar Material
                  </a>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="p-3 sm:p-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                {selectedMaterial.type === 'pdf' && '💡 Use Ctrl/Cmd + scroll para dar zoom'}
                {selectedMaterial.type === 'video' && '💡 Use espaço para pausar/continuar'}
              </p>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCloseMaterial}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition"
                >
                  Fechar
                </button>
                
                <a
                  href={selectedMaterial.file_url}
                  download
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold text-sm rounded-lg transition inline-flex items-center justify-center gap-2"
                >
                  <span>⬇️</span>
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
