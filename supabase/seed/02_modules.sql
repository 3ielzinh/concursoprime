-- Seed data for modules
-- Get category IDs first (you'll need to update these after running the categories seed)

-- Police modules
INSERT INTO public.modules (category_id, name, description, "order") 
SELECT id, 'Polícia Federal - Agente', 'Preparação para o concurso de Agente da Polícia Federal', 1
FROM public.categories WHERE name = 'policiais';

-- Bank modules
INSERT INTO public.modules (category_id, name, description, "order")
SELECT id, 'Banco do Brasil - Escriturário', 'Preparação para concurso do Banco do Brasil', 1
FROM public.categories WHERE name = 'bancarias';

-- ENEM modules
INSERT INTO public.modules (category_id, name, description, "order")
SELECT id, 'ENEM - Preparação Completa', 'Todas as áreas do conhecimento para o ENEM', 1
FROM public.categories WHERE name = 'enem_vestibular';
