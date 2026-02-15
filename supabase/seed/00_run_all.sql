-- Master seed file - Run this after schema.sql
-- This will populate your database with initial data

-- Execute in order:
\i supabase/seed/01_categories.sql
\i supabase/seed/02_modules.sql
\i supabase/seed/03_subjects.sql
\i supabase/seed/04_plans.sql

-- Display summary
SELECT 'Categories created: ' || COUNT(*) FROM public.categories;
SELECT 'Modules created: ' || COUNT(*) FROM public.modules;
SELECT 'Subjects created: ' || COUNT(*) FROM public.subjects;
SELECT 'Plans created: ' || COUNT(*) FROM public.plans;
SELECT 'Plan-Module links created: ' || COUNT(*) FROM public.plan_modules;
