-- ======================================================
-- 🔧 CORREÇÃO RÁPIDA: Erro 404 no Download de PDFs
-- ======================================================
-- Execute este SQL para corrigir o erro "Object not found"

-- ============================================
-- 1️⃣ Tornar o bucket público
-- ============================================
UPDATE storage.buckets 
SET public = true 
WHERE name = 'materials';

-- ============================================
-- 2️⃣ Remover políticas antigas conflitantes
-- ============================================
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND (qual::text LIKE '%materials%' OR with_check::text LIKE '%materials%')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- ============================================
-- 3️⃣ Criar apenas a política essencial de leitura pública
-- ============================================
CREATE POLICY "materials_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'materials');

-- ============================================
-- 4️⃣ Criar política de upload para autenticados
-- ============================================
CREATE POLICY "materials_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- ============================================
-- 5️⃣ Criar política de delete para autenticados
-- ============================================
CREATE POLICY "materials_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'materials');

-- ============================================
-- ✅ VERIFICAÇÃO
-- ============================================
SELECT 
  '✅ Configuração concluída!' as status,
  name as bucket,
  CASE WHEN public THEN '✅ PÚBLICO' ELSE '❌ PRIVADO' END as acesso,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'materials') as total_arquivos,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND qual::text LIKE '%materials%') as total_politicas
FROM storage.buckets 
WHERE name = 'materials';

-- Se você ver "✅ PÚBLICO" e total_politicas >= 1, está funcionando!
-- Agora teste o download na aplicação (lembre de dar Ctrl+Shift+R para limpar cache)
