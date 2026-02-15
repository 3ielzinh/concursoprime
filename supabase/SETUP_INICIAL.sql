-- ======================================================
-- SETUP INICIAL COMPLETO DO BANCO DE DADOS
-- Execute ESTE arquivo no Supabase SQL Editor
-- ======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================================
-- 1. CRIAR TABELA PROFILES (base de usuários)
-- ======================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_staff BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP WITH TIME ZONE,
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  study_goal_hours DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================================
-- 2. CRIAR TABELA DE MÓDULOS (para os 14 módulos)
-- ======================================================

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 3. CRIAR TABELA DE MATERIAIS (PDFs)
-- ======================================================

CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'quiz', 'document')),
  file_url TEXT NOT NULL,
  file_size TEXT,
  pages INT,
  duration INT,
  is_free BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 4. CRIAR TABELA DE SESSÕES DE ESTUDO
-- ======================================================

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  duration DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 5. CRIAR ÍNDICES
-- ======================================================

CREATE INDEX IF NOT EXISTS idx_modules_slug ON public.modules(slug);
CREATE INDEX IF NOT EXISTS idx_materials_module_id ON public.materials(module_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON public.materials(type);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(date);

-- ======================================================
-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
-- ======================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- ======================================================
-- 7. POLÍTICAS RLS - PROFILES
-- ======================================================

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Criar políticas
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ======================================================
-- 8. POLÍTICAS RLS - MODULES
-- ======================================================

DROP POLICY IF EXISTS "Modules are viewable by everyone" ON public.modules;
DROP POLICY IF EXISTS "Modules are insertable by authenticated users" ON public.modules;
DROP POLICY IF EXISTS "Modules are updatable by authenticated users" ON public.modules;
DROP POLICY IF EXISTS "Modules are deletable by authenticated users" ON public.modules;

CREATE POLICY "Modules are viewable by everyone"
  ON public.modules FOR SELECT USING (true);

CREATE POLICY "Modules are insertable by authenticated users"
  ON public.modules FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Modules are updatable by authenticated users"
  ON public.modules FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Modules are deletable by authenticated users"
  ON public.modules FOR DELETE TO authenticated USING (true);

-- ======================================================
-- 9. POLÍTICAS RLS - MATERIALS
-- ======================================================

DROP POLICY IF EXISTS "Materials are viewable by everyone" ON public.materials;
DROP POLICY IF EXISTS "Materials are insertable by authenticated users" ON public.materials;
DROP POLICY IF EXISTS "Materials are updatable by authenticated users" ON public.materials;
DROP POLICY IF EXISTS "Materials are deletable by authenticated users" ON public.materials;

CREATE POLICY "Materials are viewable by everyone"
  ON public.materials FOR SELECT USING (true);

CREATE POLICY "Materials are insertable by authenticated users"
  ON public.materials FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Materials are updatable by authenticated users"
  ON public.materials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Materials are deletable by authenticated users"
  ON public.materials FOR DELETE TO authenticated USING (true);

-- ======================================================
-- 10. POLÍTICAS RLS - STUDY_SESSIONS
-- ======================================================

DROP POLICY IF EXISTS "Users can view their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can create their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.study_sessions;

CREATE POLICY "Users can view their own study sessions"
  ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions"
  ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions"
  ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);

-- ======================================================
-- 11. FUNÇÃO PARA CRIAR PROFILE AUTOMATICAMENTE
-- ======================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ======================================================
-- 12. CRIAR PROFILES PARA USUÁRIOS EXISTENTES
-- ======================================================

-- Se você já tem usuários no auth.users mas não tem profiles, execute:
INSERT INTO public.profiles (id, username, created_at)
SELECT id, email, created_at 
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- ======================================================
-- 13. INSERIR 14 MÓDULOS INICIAIS
-- ======================================================

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
ON CONFLICT (slug) DO NOTHING;

-- ======================================================
-- 14. DEFINIR PRIMEIRO USUÁRIO COMO ADMIN
-- ======================================================

-- Torna o primeiro usuário cadastrado como administrador
UPDATE public.profiles 
SET is_staff = true, is_premium = true
WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);

-- ======================================================
-- 15. VERIFICAR SETUP
-- ======================================================

-- Ver tabelas criadas
SELECT 'Tabelas criadas:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'modules', 'materials', 'study_sessions')
ORDER BY table_name;

-- Ver módulos inseridos
SELECT 'Módulos inseridos:' as info;
SELECT COUNT(*) as total_modulos FROM public.modules;

-- Ver usuário admin
SELECT 'Usuário Admin:' as info;
SELECT id, username, is_staff, is_premium, created_at 
FROM public.profiles 
WHERE is_staff = true;

-- Ver todos os usuários
SELECT 'Todos os usuários:' as info;
SELECT id, username, is_staff, is_premium, created_at 
FROM public.profiles 
ORDER BY created_at;
