-- ======================================================
-- 🚀 CORREÇÃO RÁPIDA: Inserir 14 Módulos
-- ======================================================
-- Execute este SQL se você está vendo "Módulo não encontrado"

-- 1️⃣ VERIFICAR SE JÁ EXISTEM MÓDULOS
SELECT COUNT(*) as total_modulos FROM public.modules;
-- Se retornar 0: Execute os INSERTs abaixo
-- Se retornar 14: Os módulos já existem, pule para o passo 2

-- 2️⃣ INSERIR OS 14 MÓDULOS (caso não existam)
INSERT INTO public.modules (slug, title, description, icon, is_premium, display_order) VALUES
  ('policiais', 'CARREIRAS POLICIAIS', 'PF, PRF, PC, PM, Perito, Delegado e mais', '🛡️', true, 1),
  ('militares', 'CARREIRAS MILITARES', 'Exército, Marinha, Aeronáutica, Bombeiros', '⭐', true, 2),
  ('fiscais', 'CARREIRAS FISCAIS', 'Receita Federal, SEFAZ, ISS, TCU, CGU', '💰', true, 3),
  ('juridicas', 'CARREIRAS JURÍDICAS', 'Magistratura, MP, Defensoria, AGU, TRF, TJ', '⚖️', true, 4),
  ('bancarias', 'CARREIRAS BANCÁRIAS', 'BB, Caixa, Banco Central, BNDES, Privados', '🏦', true, 5),
  ('educacao', 'CARREIRAS EM EDUCAÇÃO', 'Professor, Pedagogo, Coordenador, IFES', '📚', true, 6),
  ('saude', 'CARREIRAS EM SAÚDE', 'Médico, Enfermeiro, Farmacêutico, SUS', '🏥', true, 7),
  ('administrativas', 'CARREIRAS ADMINISTRATIVAS', 'Analista, Técnico, Assistente Administrativo', '📋', true, 8),
  ('ti', 'CARREIRAS TI', 'Analista de Sistemas, Desenvolvedor, Suporte', '💻', true, 9),
  ('engenharia', 'CARREIRAS EM ENGENHARIA', 'Civil, Elétrica, Mecânica, Ambiental', '⚙️', true, 10),
  ('controle', 'CONTROLE E FISCALIZAÇÃO', 'Auditor, CGU, TCU, INSS, IBAMA, ANVISA', '🔍', true, 11),
  ('correios', 'CORREIOS E LOGÍSTICA', 'Carteiro, Agente, Operador, Atendente', '📦', true, 12),
  ('legislativa', 'ÁREA LEGISLATIVA', 'Câmara, Senado, Assembleias, Consultor', '🏛️', true, 13),
  ('enem', 'ENEM E VESTIBULARES', 'ENEM, FUVEST, UNICAMP, ITA, IME, AFA', '🎓', true, 14)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  is_premium = EXCLUDED.is_premium,
  display_order = EXCLUDED.display_order;

-- 3️⃣ VERIFICAR SE FORAM INSERIDOS
SELECT slug, title, icon FROM public.modules ORDER BY display_order;
-- Deve mostrar 14 linhas

-- 4️⃣ VERIFICAR SE OS MATERIAIS TÊM O MODULE_ID CORRETO
SELECT 
  mod.slug,
  mod.title,
  COUNT(m.id) as total_materiais
FROM public.modules mod
LEFT JOIN public.materials m ON m.module_id = mod.id
GROUP BY mod.id, mod.slug, mod.title
ORDER BY total_materiais DESC;

-- 5️⃣ SE OS MATERIAIS NÃO APARECEM NO MÓDULO CORRETO
-- Verificar se module_id está NULL ou errado
SELECT 
  m.id,
  m.title,
  m.module_id,
  m.created_at
FROM public.materials m
WHERE m.module_id IS NULL 
   OR m.module_id NOT IN (SELECT id FROM public.modules)
LIMIT 10;

-- 6️⃣ CORREÇÃO: Associar materiais órfãos ao módulo policiais
/*
-- Descomente e execute se necessário:
UPDATE public.materials
SET module_id = (SELECT id FROM public.modules WHERE slug = 'policiais')
WHERE module_id IS NULL;
*/

-- ======================================================
-- ✅ RESULTADO ESPERADO
-- ======================================================
-- Após executar este script, você deve ver:
-- - 14 módulos cadastrados
-- - Seus PDFs associados ao módulo correto
-- - /modules/policiais deve funcionar
