# Setup do Banco de Dados Supabase

## ⚠️ IMPORTANTE: Execute este SQL no Supabase SQL Editor

**URL:** https://supabase.com/dashboard/project/pvugplqtptiuwblgcnek/sql/new

## Script Completo (copie tudo e execute de uma vez):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: study_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_name TEXT NOT NULL,
  duration DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(date);

-- ============================================
-- RLS (Row Level Security) - study_sessions
-- ============================================
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Apagar policies antigas se existirem
DROP POLICY IF EXISTS "Users can view their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can create their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.study_sessions;

-- Criar policies
CREATE POLICY "Users can view their own study sessions" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" ON public.study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions" ON public.study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Ver estrutura da tabela criada
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'study_sessions'
ORDER BY ordinal_position;
```

## ✅ Após executar o SQL:

1. Você verá a estrutura da tabela no resultado
2. Recarregue a página http://localhost:3000/study
3. Tente registrar um estudo novamente

## 🔍 Se outras tabelas estiverem faltando:

Execute também o schema completo do arquivo `supabase/schema.sql` no SQL Editor.
