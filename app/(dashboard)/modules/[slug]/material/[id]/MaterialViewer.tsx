'use client'

import { useState, useEffect, useRef } from 'react'

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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Timeout para remover loading mesmo se onLoad não disparar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // Remove loading após 1.5 segundos no máximo

    return () => clearTimeout(timer)
  }, [material.id]) // Resetar quando trocar de material

  // Preload do PDF para carregamento mais rápido
  useEffect(() => {
    if (material.type === 'pdf' && material.file_url) {
      // Prefetch do PDF
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = material.file_url
      link.as = 'document'
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [material.file_url, material.type])

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
      {/* Indicador de carregamento otimizado */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#0a0a0a] backdrop-blur-sm transition-opacity duration-300">
          <div className="text-center">
            <div className="relative mb-3">
              <div className="w-12 h-12 border-3 border-gray-700 border-t-[#D4AF37] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
            </div>
            <p className="text-white font-medium text-sm">Carregando...</p>
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
        // Visualizador de PDF otimizado
        <div className="w-full h-full flex flex-col">
          <iframe
            ref={iframeRef}
            src={`${material.file_url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-width&pagemode=none`}
            className="w-full h-full border-0"
            title={material.title}
            loading="eager"
            onLoad={() => {
              setIsLoading(false)
            }}
            style={{ minHeight: 'calc(100vh - 64px)' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : material.type === 'video' ? (
        // Player de Vídeo otimizado
        <div className="w-full h-full flex items-center justify-center p-4 bg-black">
          <video
            src={material.file_url}
            controls
            controlsList="nodownload"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            preload="auto"
            onCanPlay={() => setIsLoading(false)}
            autoPlay
            playsInline
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
