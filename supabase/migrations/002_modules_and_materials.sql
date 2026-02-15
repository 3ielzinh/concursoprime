-- Migration: Create modules and materials tables
-- Description: Tables to store course modules and their PDF/video materials

-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'quiz', 'document')),
  file_url TEXT NOT NULL,
  file_size TEXT, -- e.g., "2.5 MB"
  pages INT, -- for PDFs
  duration INT, -- for videos (in seconds)
  is_free BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_modules_slug ON public.modules(slug);
CREATE INDEX idx_materials_module_id ON public.materials(module_id);
CREATE INDEX idx_materials_type ON public.materials(type);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules table
-- Everyone can read modules
CREATE POLICY "Modules are viewable by everyone"
  ON public.modules
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete (for admin)
CREATE POLICY "Modules are insertable by authenticated users"
  ON public.modules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Modules are updatable by authenticated users"
  ON public.modules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Modules are deletable by authenticated users"
  ON public.modules
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for materials table
-- Everyone can read materials
CREATE POLICY "Materials are viewable by everyone"
  ON public.materials
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete (for admin)
CREATE POLICY "Materials are insertable by authenticated users"
  ON public.materials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Materials are updatable by authenticated users"
  ON public.materials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Materials are deletable by authenticated users"
  ON public.materials
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial modules data
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

-- Add some sample materials for testing (optional - remove if you want to add real content)
-- Example for 'policiais' module:
-- You can add these after you upload PDFs to Supabase Storage

-- INSERT INTO public.materials (module_id, title, description, type, file_url, file_size, pages, is_free, display_order)
-- SELECT 
--   id,
--   'Direito Constitucional - Apostila Completa',
--   'Material completo sobre Direito Constitucional para carreiras policiais',
--   'pdf',
--   'materials/policiais/constitucional.pdf',
--   '2.5 MB',
--   120,
--   false,
--   1
-- FROM public.modules WHERE slug = 'policiais';
