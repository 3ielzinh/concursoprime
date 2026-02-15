-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/pvugplqtptiuwblgcnek/sql/new

-- 1. Adicionar coluna subject_name para aceitar texto livre
ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS subject_name TEXT;

-- 2. Tornar subject_id opcional (nullable) 
ALTER TABLE public.study_sessions
  ALTER COLUMN subject_id DROP NOT NULL;

-- 3. Adicionar constraint para garantir que ao menos um campo está preenchido
ALTER TABLE public.study_sessions
  DROP CONSTRAINT IF EXISTS subject_name_or_id_required;
  
ALTER TABLE public.study_sessions
  ADD CONSTRAINT subject_name_or_id_required 
  CHECK (subject_id IS NOT NULL OR subject_name IS NOT NULL);

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'study_sessions'
ORDER BY ordinal_position;
