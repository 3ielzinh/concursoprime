-- Seed data for plans

-- Free Plan
INSERT INTO public.plans (name, plan_type, description, price, features, max_categories, max_modules, has_premium_categories, has_analytics, has_export)
VALUES (
  'Plano Gratuito',
  'free',
  'Plano básico para começar seus estudos',
  0.00,
  'Acesso a módulos gratuitos selecionados
Registro de horas de estudo
Dashboard básico
Cronograma simples',
  2,
  2,
  false,
  false,
  false
);

-- Bank Career Plan
INSERT INTO public.plans (name, plan_type, description, price, features, max_categories, max_modules, has_premium_categories, has_analytics, has_export)
VALUES (
  'Plano Carreira Bancária',
  'bank',
  'Acesso completo a todos os módulos para carreiras bancárias',
  39.90,
  'Todos os módulos de Carreiras Bancárias
Material para BB, CEF, BNB
Relatórios de desempenho
Cronograma personalizado
Estatísticas detalhadas
Suporte prioritário',
  1,
  999,
  true,
  true,
  true
);

-- ENEM Plan
INSERT INTO public.plans (name, plan_type, description, price, features, max_categories, max_modules, has_premium_categories, has_analytics, has_export)
VALUES (
  'Plano ENEM/Vestibular',
  'enem',
  'Preparação completa para ENEM e vestibulares',
  44.90,
  'Todos os módulos ENEM/Vestibular
Todas as áreas do conhecimento
Relatórios de desempenho
Cronograma personalizado
Simulados e estatísticas
Suporte prioritário',
  1,
  999,
  true,
  true,
  true
);

-- Police Career Plan
INSERT INTO public.plans (name, plan_type, description, price, features, max_categories, max_modules, has_premium_categories, has_analytics, has_export)
VALUES (
  'Plano Carreira Policial',
  'police',
  'Acesso completo a todos os módulos para carreiras policiais',
  49.90,
  'Todos os módulos de Carreiras Policiais
Material para PF, PRF, PC, PM
Relatórios de desempenho
Cronograma personalizado
Estatísticas detalhadas
Suporte prioritário',
  1,
  999,
  true,
  true,
  true
);

-- PRO Plan (All Access)
INSERT INTO public.plans (name, plan_type, description, price, features, max_categories, max_modules, has_premium_categories, has_analytics, has_export)
VALUES (
  'Plano PRO - Acesso Total',
  'pro',
  'Acesso ilimitado a TODOS os módulos e categorias',
  99.90,
  'TODOS os módulos disponíveis
TODAS as categorias
Carreiras Policiais
Carreiras Bancárias
ENEM/Vestibular
Carreiras Militares
Carreiras Fiscais
Carreiras Jurídicas
Relatórios avançados
Exportação de dados
Metas personalizadas
Estatísticas completas
Suporte VIP',
  999,
  999,
  true,
  true,
  true
);

-- Link modules to plans
-- Bank Plan -> Bank Module
INSERT INTO public.plan_modules (plan_id, module_id)
SELECT p.id, m.id
FROM public.plans p, public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE p.plan_type = 'bank' AND c.name = 'bancarias';

-- ENEM Plan -> ENEM Module
INSERT INTO public.plan_modules (plan_id, module_id)
SELECT p.id, m.id
FROM public.plans p, public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE p.plan_type = 'enem' AND c.name = 'enem_vestibular';

-- Police Plan -> Police Module
INSERT INTO public.plan_modules (plan_id, module_id)
SELECT p.id, m.id
FROM public.plans p, public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE p.plan_type = 'police' AND c.name = 'policiais';

-- PRO Plan -> All Modules
INSERT INTO public.plan_modules (plan_id, module_id)
SELECT p.id, m.id
FROM public.plans p, public.modules m
WHERE p.plan_type = 'pro';
