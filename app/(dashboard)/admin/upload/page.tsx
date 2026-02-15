'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Função para sanitizar nomes de arquivo (remove acentos, espaços e caracteres especiais)
function sanitizeFileName(fileName: string): string {
  // Separar nome e extensão
  const lastDotIndex = fileName.lastIndexOf('.')
  const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : ''

  // Normalizar e remover acentos
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais (mantém letras, números, espaços, hífens)
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, '') // Remove hífens no início/fim
    .toLowerCase()

  return normalized + extension.toLowerCase()
}

interface Module {
  id: string
  slug: string
  title: string
  icon: string
}

interface FileWithMetadata {
  file: File
  title: string
  description: string
  pages: number
}

export default function UploadMaterialsPage() {
  const supabase = createClient()
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModule, setSelectedModule] = useState('')
  const [files, setFiles] = useState<FileWithMetadata[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    loadModules()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadModules() {
    const { data } = await supabase
      .from('modules')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) {
      setModules(data)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || [])
    
    const newFiles = selectedFiles.map(file => ({
      file,
      title: file.name.replace('.pdf', ''),
      description: '',
      pages: 0
    }))

    setFiles([...files, ...newFiles])
  }

  function updateFileMetadata(index: number, field: keyof Omit<FileWithMetadata, 'file'>, value: string | number) {
    const updated = [...files]
    updated[index] = { ...updated[index], [field]: value }
    setFiles(updated)
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (!selectedModule) {
      setMessage('Selecione um módulo primeiro')
      setMessageType('error')
      return
    }

    if (files.length === 0) {
      setMessage('Adicione pelo menos um arquivo PDF')
      setMessageType('error')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const selectedModuleData = modules.find(m => m.id === selectedModule)
      if (!selectedModuleData) throw new Error('Módulo não encontrado')

      let successCount = 0
      let errorCount = 0
      const errorDetails: string[] = []

      for (const fileData of files) {
        try {
          // 1. Upload do arquivo para o Supabase Storage
          const sanitizedName = sanitizeFileName(fileData.file.name)
          const fileName = `${selectedModuleData.slug}/${Date.now()}-${sanitizedName}`
          const { error: uploadError } = await supabase.storage
            .from('materials')
            .upload(fileName, fileData.file)

          if (uploadError) {
            console.error('Erro no upload do arquivo:', uploadError)
            errorDetails.push(`${fileData.file.name}: ${uploadError.message}`)
            throw uploadError
          }

          // 2. Obter URL pública do arquivo
          const { data: { publicUrl } } = supabase.storage
            .from('materials')
            .getPublicUrl(fileName)

          // 3. Calcular tamanho do arquivo
          const fileSizeInMB = (fileData.file.size / (1024 * 1024)).toFixed(2)

          // 4. Inserir registro na tabela materials
          const { error: insertError } = await supabase
            .from('materials')
            .insert({
              module_id: selectedModule,
              title: fileData.title,
              description: fileData.description || null,
              type: 'pdf',
              file_url: publicUrl,
              file_size: `${fileSizeInMB} MB`,
              pages: fileData.pages || null,
              is_free: false,
              display_order: 0
            })

          if (insertError) {
            console.error('Erro ao inserir no banco:', insertError)
            errorDetails.push(`${fileData.file.name}: ${insertError.message}`)
            throw insertError
          }

          successCount++
        } catch (error) {
          console.error('Erro completo:', error)
          errorCount++
        }
      }

      if (errorCount > 0 && errorDetails.length > 0) {
        const firstErrors = errorDetails.slice(0, 3).join('\n')
        const moreErrors = errorDetails.length > 3 ? `\n... e mais ${errorDetails.length - 3} erros` : ''
        setMessage(
          `${successCount > 0 ? `✅ ${successCount} arquivo(s) enviado(s)\n` : ''}❌ ${errorCount} erro(s):\n\n${firstErrors}${moreErrors}`
        )
        setMessageType('error')
      } else if (successCount > 0) {
        setMessage(`✅ Upload concluído! ${successCount} arquivo(s) enviado(s) com sucesso!`)
        setMessageType('success')
      }

      // Limpar formulário se tudo deu certo
      if (errorCount === 0) {
        setFiles([])
        setSelectedModule('')
      }
    } catch (error) {
      console.error('Erro geral:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro crítico: ${errorMessage}`)
      setMessageType('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/users" 
          className="inline-flex items-center text-[#D4AF37] hover:text-[#FFD700] mb-4 transition"
        >
          <span className="mr-2">←</span>
          Voltar para Admin
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2">Upload de Materiais (PDFs)</h1>
        <p className="text-gray-400">Faça upload de PDFs em lote para os módulos</p>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-500/10 border border-green-500 text-green-400' 
            : 'bg-red-500/10 border border-red-500 text-red-400'
        }`}>
          <pre className="whitespace-pre-wrap font-sans text-sm">{message}</pre>
        </div>
      )}

      {/* Seleção de Módulo */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">1. Selecione o Módulo</h2>
        
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          disabled={uploading}
        >
          <option value="">Escolha um módulo...</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.icon} {module.title}
            </option>
          ))}
        </select>
      </div>

      {/* Upload de Arquivos */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">2. Adicione os PDFs</h2>
        
        <div className="mb-4">
          <label className="block w-full">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#D4AF37] transition cursor-pointer">
              <div className="text-5xl mb-3">📄</div>
              <p className="text-white font-semibold mb-1">
                Clique para selecionar PDFs
              </p>
              <p className="text-gray-400 text-sm">
                Você pode selecionar múltiplos arquivos de uma vez
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Lista de Arquivos Selecionados */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">
              Arquivos selecionados ({files.length})
            </h3>
            
            {files.map((fileData, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate mb-1">
                      {fileData.file.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 transition"
                    disabled={uploading}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={fileData.title}
                      onChange={(e) => updateFileMetadata(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Nome do material"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Páginas
                    </label>
                    <input
                      type="number"
                      value={fileData.pages || ''}
                      onChange={(e) => updateFileMetadata(index, 'pages', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Ex: 45"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Descrição (opcional)
                    </label>
                    <input
                      type="text"
                      value={fileData.description}
                      onChange={(e) => updateFileMetadata(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Breve descrição"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão de Upload */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setFiles([])
            setSelectedModule('')
            setMessage('')
          }}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
          disabled={uploading}
        >
          Limpar Tudo
        </button>
        
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedModule || files.length === 0}
          className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>⬆️</span>
              <span>Fazer Upload ({files.length} arquivo{files.length !== 1 ? 's' : ''})</span>
            </>
          )}
        </button>
      </div>

      {/* Instruções */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">📝 Instruções</h3>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>• Selecione o módulo de destino antes de adicionar os arquivos</li>
          <li>• Você pode selecionar múltiplos PDFs de uma vez pressionando Ctrl/Cmd</li>
          <li>• Preencha os metadados de cada arquivo (título é obrigatório)</li>
          <li>• O número de páginas ajuda os alunos a planejarem o estudo</li>
          <li>• O tamanho do arquivo é calculado automaticamente</li>
          <li>• Os PDFs serão armazenados no Supabase Storage</li>
        </ul>
      </div>
    </div>
  )
}
