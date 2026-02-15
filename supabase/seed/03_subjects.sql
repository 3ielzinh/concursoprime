-- Seed data for subjects

-- Polícia Federal subjects
INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Português', 80, 1
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Raciocínio Lógico', 60, 2
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Informática', 40, 3
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Direito Constitucional', 70, 4
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Direito Administrativo', 60, 5
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Direito Penal', 80, 6
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Legislação Especial', 50, 7
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'policiais' AND m.name = 'Polícia Federal - Agente';

-- Banco do Brasil subjects
INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Português', 60, 1
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'bancarias' AND m.name = 'Banco do Brasil - Escriturário';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Matemática Financeira', 80, 2
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'bancarias' AND m.name = 'Banco do Brasil - Escriturário';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Raciocínio Lógico', 50, 3
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'bancarias' AND m.name = 'Banco do Brasil - Escriturário';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Informática', 40, 4
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'bancarias' AND m.name = 'Banco do Brasil - Escriturário';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Conhecimentos Bancários', 70, 5
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'bancarias' AND m.name = 'Banco do Brasil - Escriturário';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Atualidades', 30, 6
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'bancarias' AND m.name = 'Banco do Brasil - Escriturário';

-- ENEM subjects
INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Matemática', 100, 1
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Português', 80, 2
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Redação', 60, 3
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Geografia', 60, 4
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'História', 60, 5
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Física', 80, 6
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Química', 80, 7
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Biologia', 70, 8
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Literatura', 40, 9
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';

INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Inglês', 40, 10
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'enem_vestibular' AND m.name = 'ENEM - Preparação Completa';
