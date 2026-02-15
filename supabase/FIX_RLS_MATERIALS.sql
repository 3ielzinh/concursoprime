-- ======================================================
-- 🔧 CORREÇÃO: RLS Policies para Materials
-- ======================================================
-- Execute este SQL no Supabase SQL Editor para garantir que
-- TODOS (incluindo public) possam ler os materiais

-- 1️⃣ REMOVER POLÍTICAS RESTRITIVAS ANTIGAS (se existirem)
DROP POLICY IF EXISTS "Users can view their module materials" ON public.materials;
DROP POLICY IF EXISTS "Premium users can view premium materials" ON public.materials;
DROP POLICY IF EXISTS "Users can view materials" ON public.materials;

-- 2️⃣ CRIAR POLÍTICA PERMISSIVA: PUBLIC READ
-- Permite que QUALQUER PESSOA (logada ou não) leia os materiais
CREATE POLICY "Public can view all materials"
ON public.materials
FOR SELECT
TO public
USING (true);

-- 3️⃣ POLÍTICA DE INSERT/UPDATE/DELETE (apenas para admin)
CREATE POLICY "Authenticated users can manage materials"
ON public.materials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_staff = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_staff = true
  )
);

-- ======================================================
-- 4️⃣ VERIFICAR POLÍTICAS CRIADAS
-- ======================================================

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
WHERE tablename = 'materials'
ORDER BY policyname;

-- Resultado esperado:
-- - "Public can view all materials" | FOR SELECT | TO public | USING (true)
-- - "Authenticated users can manage materials" | FOR ALL | TO authenticated | ...

-- ======================================================
-- 5️⃣ TESTE: Buscar materiais do módulo policiais
-- ======================================================

SELECT 
  m.id,
  m.title,
  m.file_url,
  m.file_size,
  m.pages,
  mod.slug,
  mod.title as module_title
FROM public.materials m
INNER JOIN public.modules mod ON m.module_id = mod.id
WHERE mod.slug = 'policiais'
ORDER BY m.created_at DESC
LIMIT 10;

-- Se retornar 0 linhas: Os materiais não foram inseridos no banco
-- Se retornar linhas: RLS estava bloqueando antes, agora deve funcionar!

-- ======================================================
-- 6️⃣ VERIFICAR SE MODULE_ID ESTÁ CORRETO
-- ======================================================

-- Contar materiais por módulo
SELECT 
  mod.slug,
  mod.title,
  COUNT(m.id) as total_materiais
FROM public.modules mod
LEFT JOIN public.materials m ON m.module_id = mod.id
GROUP BY mod.id, mod.slug, mod.title
ORDER BY total_materiais DESC;

-- ======================================================
-- 7️⃣ SE NECESSÁRIO: CORREÇÃO DE MODULE_ID NULL
-- ======================================================

-- Verificar se há materiais sem módulo associado
SELECT COUNT(*) as materiais_orfaos
FROM public.materials
WHERE module_id IS NULL;

-- Se houver materiais órfãos, associar ao módulo policiais:
/*
UPDATE public.materials
SET module_id = (SELECT id FROM public.modules WHERE slug = 'policiais')
WHERE module_id IS NULL;
*/

-- ======================================================
-- ✅ APÓS EXECUTAR ESTE SCRIPT
-- ======================================================
-- 1. Faça logout/login na aplicação (para renovar token)
-- 2. OU simplesmente recarregue a página: https://concursoprime.netlify.app/modules/policiais
-- 3. OU faça novo deploy no Netlify (Deploys → Trigger deploy → Deploy site)
