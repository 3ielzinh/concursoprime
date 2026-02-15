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
  materials: Material[]
}

export default function ModuleDetailClient({ module, materials }: Props) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {materials.map((material) => (
            <div 
              key={material.id}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5 hover:border-[#D4AF37]/50 transition group"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">
                  {getFileIcon(material.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-[#D4AF37] transition">
                    {material.title}
                  </h3>
                  
                  {material.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {material.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
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
                    <span className="flex items-center gap-1 capitalize">
                      <span>🏷️</span>
                      {material.type}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedMaterial(material)}
                    className="w-full sm:w-auto px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition text-sm"
                  >
                    Abrir Material
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de visualização */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(selectedMaterial.type)}</span>
                <div>
                  <h3 className="text-white font-semibold">{selectedMaterial.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedMaterial.file_size} • {selectedMaterial.pages} páginas
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">📄</div>
                <h4 className="text-white text-lg font-semibold mb-2">
                  Visualizador de PDF
                </h4>
                <p className="text-gray-400 mb-6 max-w-md">
                  A visualização de PDFs será implementada em breve. Por enquanto, você pode fazer o download do material.
                </p>
                
                <a
                  href={selectedMaterial.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition inline-flex items-center gap-2"
                >
                  <span>⬇️</span>
                  Baixar Material
                </a>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Fechar
              </button>
              
              <a
                href={selectedMaterial.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition inline-flex items-center gap-2"
              >
                <span>⬇️</span>
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
