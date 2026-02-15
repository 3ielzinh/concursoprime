-- Seed data for categories
INSERT INTO public.categories (name, description, icon, color, is_premium, "order") VALUES
('policiais', 'Carreiras policiais (PF, PRF, PC, PM)', 'shield-fill-check', 'primary', false, 1),
('militares', 'Carreiras militares (Exército, Marinha, Aeronáutica)', 'star-fill', 'success', false, 2),
('fiscais', 'Carreiras fiscais (Receita Federal, Estadual)', 'cash-coin', 'warning', true, 3),
('juridicas', 'Carreiras jurídicas (OAB, Magistratura, MP)', 'bank', 'danger', true, 4),
('bancarias', 'Concursos bancários (BB, CEF, BNB)', 'piggy-bank', 'info', false, 5),
('educacao', 'Área de educação (Professor, Pedagogo)', 'book', 'primary', true, 6),
('saude', 'Área de saúde (Enfermagem, Medicina)', 'hospital', 'danger', true, 7),
('administrativa', 'Área administrativa (Assistente, Analista)', 'briefcase', 'secondary', false, 8),
('ti', 'Tecnologia da Informação', 'laptop', 'info', true, 9),
('engenharia', 'Engenharias diversas', 'gear-fill', 'warning', true, 10),
('fiscalizacao', 'Fiscalização e regulação', 'clipboard-check', 'success', true, 11),
('logistica', 'Logística e transporte', 'truck', 'primary', true, 12),
('legislativa', 'Poder legislativo (Câmara, Senado)', 'building', 'secondary', true, 13),
('enem_vestibular', 'ENEM e Vestibulares', 'mortarboard-fill', 'info', false, 14);
