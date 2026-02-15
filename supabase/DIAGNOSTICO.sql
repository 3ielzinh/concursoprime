-- ======================================================
-- 🔍 DIAGNÓSTICO: Módulos e Materiais
-- ======================================================
-- Execute este SQL no Supabase SQL Editor para diagnosticar o problema

-- 1️⃣ VERIFICAR SE OS MÓDULOS EXISTEM
SELECT '=== MÓDULOS CADASTRADOS ===' as info;
SELECT id, slug, title, is_premium 
FROM public.modules 
ORDER BY display_order;

-- Resultado esperado: 14 módulos (policiais, militares, fiscais, etc.)
-- Se retornar 0 linhas: Execute o SETUP_INICIAL.sql primeiro!

-- 2️⃣ VERIFICAR MÓDULO ESPECÍFICO "POLICIAIS"
SELECT '=== MÓDULO POLICIAIS ===' as info;
SELECT * FROM public.modules WHERE slug = 'policiais';

-- Resultado esperado: 1 linha com o módulo de carreiras policiais
-- Se não retornar: O módulo não existe, execute SETUP_INICIAL.sql

-- 3️⃣ VERIFICAR MATERIAIS CARREGADOS
SELECT '=== MATERIAIS DO MÓDULO POLICIAIS ===' as info;
SELECT 
  m.id,
  m.title,
  m.file_url,
  m.file_size,
  m.pages,
  m.is_free,
  m.display_order,
  m.created_at
FROM public.materials m
INNER JOIN public.modules mod ON m.module_id = mod.id
WHERE mod.slug = 'policiais'
ORDER BY m.display_order, m.created_at DESC;

-- Resultado esperado: 49-74 linhas (seus PDFs)
-- Se retornar 0 linhas: Os PDFs não foram registrados no banco

-- 4️⃣ CONTAR MATERIAIS POR MÓDULO
SELECT '=== TOTAL DE MATERIAIS POR MÓDULO ===' as info;
SELECT 
  mod.slug,
  mod.title,
  COUNT(m.id) as total_materiais
FROM public.modules mod
LEFT JOIN public.materials m ON m.module_id = mod.id
GROUP BY mod.id, mod.slug, mod.title
ORDER BY mod.display_order;

-- Resultado esperado: Módulo 'policiais' deve ter 49-74 materiais

-- 5️⃣ VERIFICAR STORAGE (URLs dos arquivos)
SELECT '=== EXEMPLOS DE URLs ===' as info;
SELECT 
  title,
  file_url,
  file_size
FROM public.materials
WHERE module_id = (SELECT id FROM public.modules WHERE slug = 'policiais')
LIMIT 5;

-- Resultado esperado: URLs começando com https://...supabase.co/storage/v1/object/public/materials/policiais/...

-- ======================================================
-- 📊 INTERPRETAÇÃO DOS RESULTADOS
-- ======================================================

-- CENÁRIO 1: "0 módulos encontrados"
--   ❌ Problema: Banco não foi inicializado
--   ✅ Solução: Execute o SETUP_INICIAL.sql

-- CENÁRIO 2: "Módulos existem mas 0 materiais no módulo policiais"
--   ❌ Problema: Upload salvou no storage mas não inseriu no banco
--   ✅ Solução: Verifique a tabela storage.objects (query abaixo)

-- CENÁRIO 3: "Materiais existem mas module_id está NULL ou errado"
--   ❌ Problema: Relacionamento entre materials e modules está quebrado
--   ✅ Solução: Execute o script de correção abaixo

-- ======================================================
-- 🔧 VERIFICAÇÃO ADICIONAL: STORAGE
-- ======================================================

-- Verificar arquivos no bucket 'materials'
SELECT '=== ARQUIVOS NO STORAGE ===' as info;
SELECT 
  name,
  bucket_id,
  created_at,
  updated_at
FROM storage.objects
WHERE bucket_id = 'materials'
AND name LIKE 'policiais/%'
ORDER BY created_at DESC
LIMIT 10;

-- Resultado esperado: Deve mostrar seus PDFs no formato:
-- policiais/1771120155484-2-resumo-pm-sp-matematica-nova-concursos.pdf

-- ======================================================
-- 💡 SCRIPTS DE CORREÇÃO (SÓ USE SE NECESSÁRIO)
-- ======================================================

-- CORREÇÃO 1: Criar módulo 'policiais' se não existir
/*
INSERT INTO public.modules (slug, title, description, icon, is_premium, display_order)
VALUES ('policiais', 'CARREIRAS POLICIAIS', 'PF, PRF, PC, PM, Perito, Delegado e mais', '🛡️', true, 1)
ON CONFLICT (slug) DO NOTHING;
*/

-- CORREÇÃO 2: Associar materiais órfãos ao módulo policiais
/*
UPDATE public.materials
SET module_id = (SELECT id FROM public.modules WHERE slug = 'policiais')
WHERE module_id IS NULL;
*/

-- ======================================================
-- ✅ APÓS EXECUTAR
-- ======================================================
-- Copie todos os resultados e me envie para análise
