'use client'

import { useState, useEffect } from 'react'

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
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="w-full h-full relative bg-[#0a0a0a]">
      {/* Indicador de carregamento aprimorado */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#0a0a0a]/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-[#D4AF37] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
            <p className="text-white font-medium mb-1">Carregando material...</p>
            <p className="text-gray-500 text-sm">Aguarde enquanto preparamos a visualização</p>
          </div>
        </div>
      )}

      {/* Barra de controles flutuante */}
      {!isLoading && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-[#1a1a1a]/90 hover:bg-[#252525] border border-gray-800 rounded-lg text-white transition backdrop-blur-sm"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      )}

      {material.type === 'pdf' ? (
        // Visualizador de PDF em tela cheia aprimorado
        <div className="w-full h-full flex flex-col">
          <iframe
            src={`${material.file_url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
            className="w-full h-full border-0"
            title={material.title}
            onLoad={() => setIsLoading(false)}
            style={{ minHeight: 'calc(100vh - 64px)' }}
          />
        </div>
      ) : material.type === 'video' ? (
        // Player de Vídeo aprimorado
        <div className="w-full h-full flex items-center justify-center p-4 bg-black">
          <video
            src={material.file_url}
            controls
            controlsList="nodownload"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            preload="metadata"
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            autoPlay
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      ) : (
        // Fallback aprimorado
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 max-w-md">
            <div className="text-6xl mb-4">
              {material.type === 'text' ? '📝' : '📎'}
            </div>
            <h2 className="text-white text-xl font-bold mb-2">
              Visualização Não Disponível
            </h2>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Este tipo de arquivo não possui visualização integrada no navegador. 
              Faça o download para acessar o conteúdo completo.
            </p>
            
            <a
              href={material.file_url}
              download
              className="w-full px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Baixar Material</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialViewer
