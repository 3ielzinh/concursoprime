-- ======================================================
-- 🔧 DIAGNÓSTICO E CORREÇÃO: Storage - Download de PDFs
-- ======================================================
-- Execute este SQL se você está vendo erro 404 ao baixar PDFs

-- ============================================
-- 1️⃣ DIAGNÓSTICO: Verificar Bucket
-- ============================================

-- Verificar se o bucket 'materials' existe e está configurado como público
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'materials';

-- ✅ RESULTADO ESPERADO:
-- name: materials
-- public: true (DEVE SER TRUE!)
-- 
-- ❌ SE RETORNAR VAZIO: O bucket não existe (vá para o passo 3)
-- ❌ SE public = false: O bucket não está público (vá para o passo 4)


-- ============================================
-- 2️⃣ DIAGNÓSTICO: Verificar Políticas RLS
-- ============================================

-- Verificar políticas de acesso aos arquivos
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND (qual::text LIKE '%materials%' OR with_check::text LIKE '%materials%');

-- ✅ RESULTADO ESPERADO: Deve mostrar pelo menos 1 política permitindo SELECT público
-- ❌ SE RETORNAR VAZIO: Não há políticas configuradas (vá para o passo 5)


-- ============================================
-- 3️⃣ CORREÇÃO: Criar Bucket (se não existir)
-- ============================================

-- Execute APENAS se o bucket não existe:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials',
  true,  -- ⚠️ IMPORTANTE: Público = true para permitir downloads
  52428800,  -- 50 MB
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;


-- ============================================
-- 4️⃣ CORREÇÃO: Tornar Bucket Público
-- ============================================

-- Execute se o bucket existe mas está privado (public = false):
UPDATE storage.buckets 
SET public = true 
WHERE name = 'materials';

-- Verificar:
SELECT name, public FROM storage.buckets WHERE name = 'materials';
-- Deve retornar: public = true


-- ============================================
-- 5️⃣ CORREÇÃO: Criar Políticas de Acesso (RLS)
-- ============================================

-- ⚠️ IMPORTANTE: Estas políticas permitem que QUALQUER pessoa leia os arquivos
-- Isso é necessário para que os PDFs possam ser baixados pelos usuários

-- Remover TODAS as políticas existentes para o bucket materials (se existirem)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- Política 1: LEITURA PÚBLICA (permite download por qualquer pessoa)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Política 2: UPLOAD (apenas usuários autenticados)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Política 3: ATUALIZAÇÃO (apenas usuários autenticados)
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');

-- Política 4: DELEÇÃO (apenas usuários autenticados)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'materials');


-- ============================================
-- 6️⃣ VERIFICAÇÃO FINAL
-- ============================================

-- Verificar configuração do bucket
SELECT 
  '✅ Bucket configurado' as status,
  name,
  CASE 
    WHEN public THEN '✅ PÚBLICO' 
    ELSE '❌ PRIVADO (PROBLEMA!)' 
  END as acesso,
  file_size_limit / 1024 / 1024 || ' MB' as limite_tamanho
FROM storage.buckets 
WHERE name = 'materials';

-- Verificar políticas
SELECT 
  '✅ Política: ' || policyname as status,
  'Comando: ' || cmd as tipo,
  CASE 
    WHEN roles::text LIKE '%public%' THEN '✅ Acesso PÚBLICO'
    WHEN roles::text LIKE '%authenticated%' THEN '🔒 Apenas AUTENTICADOS'
    ELSE '⚠️ ' || roles::text
  END as permissao
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND (qual::text LIKE '%materials%' OR with_check::text LIKE '%materials%')
ORDER BY policyname;

-- Verificar arquivos no storage
SELECT 
  COUNT(*) as total_arquivos,
  ROUND(SUM((metadata->>'size')::bigint) / 1024.0 / 1024.0, 2) as tamanho_total_mb
FROM storage.objects
WHERE bucket_id = 'materials';


-- ============================================
-- 7️⃣ TESTAR URLS DOS ARQUIVOS
-- ============================================

-- Ver primeiros 5 arquivos e suas URLs
SELECT 
  name as arquivo,
  created_at,
  (metadata->>'size')::bigint / 1024 || ' KB' as tamanho,
  'https://' || (SELECT current_setting('app.settings.api_url', true)) || '/storage/v1/object/public/materials/' || name as url_publica
FROM storage.objects
WHERE bucket_id = 'materials'
ORDER BY created_at DESC
LIMIT 5;


-- ============================================
-- 8️⃣ VERIFICAR MATERIAIS NO BANCO
-- ============================================

-- Ver os materiais cadastrados e suas URLs
SELECT 
  m.id,
  m.title,
  m.file_url,
  m.file_size,
  m.created_at,
  mod.slug as modulo
FROM materials m
LEFT JOIN modules mod ON mod.id = m.module_id
ORDER BY m.created_at DESC
LIMIT 5;


-- ======================================================
-- ✅ CHECKLIST DE VERIFICAÇÃO
-- ======================================================
/*
Após executar este script, confirme:

1. ✅ Bucket 'materials' existe e está PUBLIC = true
2. ✅ Há pelo menos 1 política permitindo SELECT público
3. ✅ Há arquivos no storage (total_arquivos > 0)
4. ✅ As URLs dos materiais começam com https://

SE TUDO ESTIVER OK mas ainda der erro 404:
- Verifique se a URL no banco está correta
- Tente fazer um novo upload de teste
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Tente em uma aba anônima do navegador
*/

-- ======================================================
-- 🔧 CORREÇÃO ALTERNATIVA: Recriar URLs
-- ======================================================
-- Execute APENAS se as URLs dos materiais estiverem erradas

/*
-- Ver a URL base do seu projeto (copie e cole abaixo)
SELECT current_setting('app.settings.api_url', true);

-- Exemplo de URL correta:
-- https://abcdefghij.supabase.co/storage/v1/object/public/materials/policiais/1234567890-arquivo.pdf

-- Se suas URLs estão erradas, você pode atualizá-las:
-- (Substitua 'SUAURL' pela URL do seu projeto)

UPDATE materials
SET file_url = REGEXP_REPLACE(
  file_url,
  'https://.+?/storage',
  'https://SUAURL.supabase.co/storage',
  'g'
)
WHERE file_url LIKE '%storage%';
*/
