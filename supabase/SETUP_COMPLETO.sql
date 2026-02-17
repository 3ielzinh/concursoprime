-- ============================================
-- SETUP COMPLETO DO BANCO DE DADOS
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================

-- Este script configura o banco de dados com:
-- 1. Schema principal (tabelas)
-- 2. Todas as migrações
-- 3. Políticas RLS para segurança multi-usuário
-- 4. Triggers automáticos

-- ============================================
-- PARTE 1: SCHEMA PRINCIPAL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_staff BOOLEAN DEFAULT FALSE,
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  study_goal_hours DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'book',
  color TEXT DEFAULT 'primary',
  background_image TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  background_image TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  estimated_hours DECIMAL(5,2) DEFAULT 0,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  plan_type TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  features TEXT,
  max_categories INTEGER DEFAULT 3,
  max_modules INTEGER DEFAULT 10,
  has_premium_categories BOOLEAN DEFAULT FALSE,
  has_analytics BOOLEAN DEFAULT FALSE,
  has_export BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan Modules (many-to-many)
CREATE TABLE IF NOT EXISTS public.plan_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  UNIQUE(plan_id, module_id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  payment_method TEXT,
  last_payment_date DATE,
  next_payment_date DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Sessions table
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  duration DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Module Access table
CREATE TABLE IF NOT EXISTS public.user_module_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  custom_access_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Allowed Categories (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_allowed_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_module_access_id UUID REFERENCES public.user_module_access(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(user_module_access_id, category_id)
);

-- User Access Logs table
CREATE TABLE IF NOT EXISTS public.user_access_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PARTE 2: MIGRAÇÕES
-- ============================================

-- Migração 001: Adicionar subject_name em study_sessions
ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS subject_name TEXT;

ALTER TABLE public.study_sessions
  ALTER COLUMN subject_id DROP NOT NULL;

ALTER TABLE public.study_sessions
  DROP CONSTRAINT IF EXISTS subject_name_or_id_required;

ALTER TABLE public.study_sessions
  ADD CONSTRAINT subject_name_or_id_required 
  CHECK (subject_id IS NOT NULL OR subject_name IS NOT NULL);

-- Migração 003: Atualizar tabela schedules
ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS subject_name TEXT;

ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

ALTER TABLE public.schedules
  ALTER COLUMN subject_id DROP NOT NULL;

ALTER TABLE public.schedules
  DROP CONSTRAINT IF EXISTS subject_name_or_id_required;

ALTER TABLE public.schedules
  ADD CONSTRAINT subject_name_or_id_required 
  CHECK (subject_id IS NOT NULL OR subject_name IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_of_week ON public.schedules(day_of_week);

-- ============================================
-- PARTE 3: POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- Políticas para study_sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver suas próprias sessões" ON public.study_sessions;
CREATE POLICY "Usuários podem ver suas próprias sessões"
ON public.study_sessions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias sessões" ON public.study_sessions;
CREATE POLICY "Usuários podem criar suas próprias sessões"
ON public.study_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias sessões" ON public.study_sessions;
CREATE POLICY "Usuários podem atualizar suas próprias sessões"
ON public.study_sessions FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias sessões" ON public.study_sessions;
CREATE POLICY "Usuários podem deletar suas próprias sessões"
ON public.study_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para schedules
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver seus próprios cronogramas" ON public.schedules;
CREATE POLICY "Usuários podem ver seus próprios cronogramas"
ON public.schedules FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar seus próprios cronogramas" ON public.schedules;
CREATE POLICY "Usuários podem criar seus próprios cronogramas"
ON public.schedules FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios cronogramas" ON public.schedules;
CREATE POLICY "Usuários podem atualizar seus próprios cronogramas"
ON public.schedules FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios cronogramas" ON public.schedules;
CREATE POLICY "Usuários podem deletar seus próprios cronogramas"
ON public.schedules FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Permitir leitura pública de categories, modules, subjects
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categorias são visíveis para todos usuários autenticados" ON public.categories;
CREATE POLICY "Categorias são visíveis para todos usuários autenticados"
ON public.categories FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Módulos são visíveis para todos usuários autenticados" ON public.modules;
CREATE POLICY "Módulos são visíveis para todos usuários autenticados"
ON public.modules FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Matérias são visíveis para todos usuários autenticados" ON public.subjects;
CREATE POLICY "Matérias são visíveis para todos usuários autenticados"
ON public.subjects FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- PARTE 4: TRIGGERS
-- ============================================

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que chama a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CONCLUÍDO!
-- ============================================

-- Verificar se tudo foi criado corretamente:
SELECT 'Tabelas criadas:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

SELECT 'Políticas RLS ativas:' as status;
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
