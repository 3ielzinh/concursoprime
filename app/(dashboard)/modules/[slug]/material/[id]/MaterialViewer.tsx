'use client'

import { useState } from 'react'

interface Material {
  id: string
  title: string
  type: string
  file_url: string
}

interface MaterialViewerProps {
  material: Material
}

function MaterialViewer({ material }: MaterialViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="w-full h-full relative bg-black">
      {/* Indicador de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p>Carregando material...</p>
          </div>
        </div>
      )}

      {material.type === 'pdf' ? (
        // Visualizador de PDF em tela cheia
        <iframe
          src={material.file_url}
          className="w-full h-full"
          title={material.title}
          onLoad={() => setIsLoading(false)}
          style={{ minHeight: 'calc(100vh - 64px)' }}
        />
      ) : material.type === 'video' ? (
        // Player de Vídeo em tela cheia
        <div className="w-full h-full flex items-center justify-center p-4">
          <video
            src={material.file_url}
            controls
            controlsList="nodownload"
            className="max-w-full max-h-full"
            preload="metadata"
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            autoPlay
          >
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      ) : (
        // Fallback para outros tipos
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="text-6xl mb-4">
            {material.type === 'text' ? '📝' : '📎'}
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Material Disponível para Download
          </h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Este tipo de material não possui visualização integrada. Faça o download para acessar o conteúdo.
          </p>
          
          <a
            href={material.file_url}
            download
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition inline-flex items-center gap-2"
          >
            <span>⬇️</span>
            Baixar Material
          </a>
        </div>
      )}
    </div>
  )
}

export default MaterialViewer
