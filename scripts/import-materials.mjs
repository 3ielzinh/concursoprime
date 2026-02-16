import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração do Supabase
const SUPABASE_URL = 'https://pvugplqtptiuwblgcnek.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dWdwbHF0cHRpdXdibGdjbmVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTEwMTUyNSwiZXhwIjoyMDg2Njc3NTI1fQ.YgpBV0OYrQebvFj_aaO4T18h2DzYwuuKPEc6cXpTCXE'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Pasta principal onde estão os PDFs
const BASE_PATH = 'C:\\Users\\Admin\\Desktop\\PDF\\CONTEÚDO'

// Mapeamento de pastas para slugs de módulos
const MODULE_MAPPING = {
  'CARREIRAS EM EDUCAÇÃO': 'educacao',
  'CARREIRAS EM SAÚDE': 'saude',
  'CARREIRAS ADMINISTRATIVAS': 'administrativas',
  'CARREIRAS TI': 'ti',
  'CARREIRAS EM ENGENHARIA': 'engenharia',
  'CONTROLE E FISCALIZAÇÃO': 'controle',
  'CORREIOS E LOGÍSTICA': 'correios',
  'ÁREA LEGISLATIVA': 'legislativa',
  'ENEM E VESTIBULARES': 'enem',
}

// Função para sanitizar nomes de arquivo
function sanitizeFileName(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.')
  const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : ''

  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return normalized + extension.toLowerCase()
}

// Função para verificar se é PDF
function isPDF(fileName) {
  return fileName.toLowerCase().endsWith('.pdf')
}

// Função para verificar se é imagem
function isImage(fileName) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

// Função para ler diretório recursivamente
function getFilesRecursively(dir, baseDir = dir) {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, baseDir))
    } else if (item.isFile() && (isPDF(item.name) || isImage(item.name))) {
      const relativePath = path.relative(baseDir, fullPath)
      files.push({
        fullPath,
        relativePath,
        fileName: item.name,
        type: isPDF(item.name) ? 'pdf' : 'image'
      })
    }
  }

  return files
}

// Função para calcular tamanho do arquivo em MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath)
  return (stats.size / (1024 * 1024)).toFixed(2)
}

// Função principal de importação
async function importMaterials() {
  console.log('🚀 Iniciando importação de materiais...\n')

  // Verificar se o diretório base existe
  if (!fs.existsSync(BASE_PATH)) {
    console.error(`❌ Erro: Diretório não encontrado: ${BASE_PATH}`)
    process.exit(1)
  }

  // Buscar todos os módulos do banco
  console.log('📦 Buscando módulos do banco de dados...')
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, slug, title')

  if (modulesError) {
    console.error('❌ Erro ao buscar módulos:', modulesError.message)
    process.exit(1)
  }

  console.log(`✅ ${modules.length} módulos encontrados\n`)

  // Criar mapa de slug -> id
  const moduleMap = {}
  modules.forEach(m => {
    moduleMap[m.slug] = m.id
  })

  // Listar pastas de módulos
  const moduleFolders = fs.readdirSync(BASE_PATH, { withFileTypes: true })
    .filter(item => item.isDirectory())

  console.log(`📁 ${moduleFolders.length} pastas de módulos encontradas\n`)
  console.log('─'.repeat(80))

  let totalFiles = 0
  let uploadedFiles = 0
  let failedFiles = 0

  for (const folder of moduleFolders) {
    const folderName = folder.name
    const folderPath = path.join(BASE_PATH, folderName)
    
    // Tentar encontrar o slug do módulo
    const moduleSlug = MODULE_MAPPING[folderName.toUpperCase()]
    
    if (!moduleSlug) {
      console.log(`⚠️  Pasta "${folderName}" não mapeada para nenhum módulo (pulando)`)
      continue
    }

    const moduleId = moduleMap[moduleSlug]
    if (!moduleId) {
      console.log(`⚠️  Módulo com slug "${moduleSlug}" não encontrado no banco (pulando)`)
      continue
    }

    console.log(`\n📚 Processando módulo: ${folderName}`)
    console.log(`   Slug: ${moduleSlug} | ID: ${moduleId}`)

    // Buscar todos os arquivos recursivamente
    const files = getFilesRecursively(folderPath)
    const pdfs = files.filter(f => f.type === 'pdf')
    const images = files.filter(f => f.type === 'image')

    console.log(`   📄 ${pdfs.length} PDFs encontrados`)
    console.log(`   🖼️  ${images.length} imagens encontradas`)

    totalFiles += files.length

    // Processar PDFs
    for (let i = 0; i < pdfs.length; i++) {
      const file = pdfs[i]
      const progress = `[${i + 1}/${pdfs.length}]`
      
      try {
        // Sanitizar nome do arquivo
        const sanitizedName = sanitizeFileName(file.fileName)
        
        // Construir caminho no storage mantendo estrutura de pastas
        const relativeFolderPath = path.dirname(file.relativePath)
        const storagePath = relativeFolderPath 
          ? `${moduleSlug}/${relativeFolderPath.split(path.sep).join('/')}/${sanitizedName}`
          : `${moduleSlug}/${sanitizedName}`

        // Ler arquivo
        const fileBuffer = fs.readFileSync(file.fullPath)
        const fileSizeMB = getFileSizeMB(file.fullPath)

        // Upload para o storage
        console.log(`   ${progress} ⬆️  Uploading: ${file.relativePath}`)
        const { error: uploadError } = await supabase.storage
          .from('materials')
          .upload(storagePath, fileBuffer, {
            contentType: 'application/pdf',
            upsert: false
          })

        if (uploadError) {
          if (uploadError.message.includes('already exists')) {
            console.log(`   ${progress} ⏭️  Arquivo já existe (pulando)`)
            continue
          }
          throw uploadError
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('materials')
          .getPublicUrl(storagePath)

        // Construir título mantendo estrutura de pastas
        const materialTitle = relativeFolderPath
          ? `${relativeFolderPath.split(path.sep).join('/')}/${file.fileName}`
          : file.fileName

        // Inserir no banco de dados
        const { error: insertError } = await supabase
          .from('materials')
          .insert({
            module_id: moduleId,
            title: materialTitle,
            type: 'pdf',
            file_url: publicUrl,
            file_size: `${fileSizeMB} MB`,
            is_free: false,
            display_order: i
          })

        if (insertError) {
          throw insertError
        }

        console.log(`   ${progress} ✅ Sucesso: ${file.fileName}`)
        uploadedFiles++

      } catch (error) {
        console.log(`   ${progress} ❌ Erro: ${file.fileName}`)
        console.log(`   Detalhes: ${error.message}`)
        failedFiles++
      }
    }

    // Processar imagens (colocar em pasta "Imagens")
    if (images.length > 0) {
      console.log(`\n   🖼️  Processando ${images.length} imagens...`)
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const progress = `[${i + 1}/${images.length}]`
        
        try {
          const sanitizedName = sanitizeFileName(file.fileName)
          
          // Imagens vão para pasta "Imagens" dentro do módulo
          const relativeFolderPath = path.dirname(file.relativePath)
          const imageFolder = relativeFolderPath 
            ? `Imagens/${relativeFolderPath.split(path.sep).join('/')}`
            : 'Imagens'
          
          const storagePath = `${moduleSlug}/${imageFolder}/${sanitizedName}`

          const fileBuffer = fs.readFileSync(file.fullPath)
          const fileSizeMB = getFileSizeMB(file.fullPath)

          console.log(`   ${progress} ⬆️  Uploading imagem: ${file.relativePath}`)
          const { error: uploadError } = await supabase.storage
            .from('materials')
            .upload(storagePath, fileBuffer, {
              contentType: `image/${path.extname(file.fileName).substring(1)}`,
              upsert: false
            })

          if (uploadError) {
            if (uploadError.message.includes('already exists')) {
              console.log(`   ${progress} ⏭️  Imagem já existe (pulando)`)
              continue
            }
            throw uploadError
          }

          const { data: { publicUrl } } = supabase.storage
            .from('materials')
            .getPublicUrl(storagePath)

          const materialTitle = `${imageFolder}/${file.fileName}`

          const { error: insertError } = await supabase
            .from('materials')
            .insert({
              module_id: moduleId,
              title: materialTitle,
              type: 'image',
              file_url: publicUrl,
              file_size: `${fileSizeMB} MB`,
              is_free: false,
              display_order: pdfs.length + i
            })

          if (insertError) {
            throw insertError
          }

          console.log(`   ${progress} ✅ Imagem: ${file.fileName}`)
          uploadedFiles++

        } catch (error) {
          console.log(`   ${progress} ❌ Erro imagem: ${file.fileName}`)
          console.log(`   Detalhes: ${error.message}`)
          failedFiles++
        }
      }
    }

    console.log('─'.repeat(80))
  }

  // Resumo final
  console.log('\n' + '═'.repeat(80))
  console.log('📊 RESUMO DA IMPORTAÇÃO')
  console.log('═'.repeat(80))
  console.log(`📁 Total de arquivos encontrados: ${totalFiles}`)
  console.log(`✅ Arquivos enviados com sucesso: ${uploadedFiles}`)
  console.log(`❌ Arquivos com erro: ${failedFiles}`)
  console.log(`⏭️  Arquivos pulados (já existentes): ${totalFiles - uploadedFiles - failedFiles}`)
  console.log('═'.repeat(80))
  console.log('\n✨ Importação concluída!\n')
}

// Executar
importMaterials().catch(error => {
  console.error('\n💥 Erro fatal:', error)
  process.exit(1)
})
