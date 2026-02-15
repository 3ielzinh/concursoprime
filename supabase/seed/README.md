# Database Seed Data

Esta pasta contém os scripts SQL para popular o banco de dados com dados iniciais.

## Ordem de Execução

Execute os scripts na seguinte ordem no Supabase SQL Editor:

### 1. Schema (primeiro!)
Execute `supabase/schema.sql` primeiro para criar todas as tabelas.

### 2. Seed Data
Depois execute os arquivos de seed na ordem:

1. **01_categories.sql** - 14 categorias de concursos
   - Policiais, Militares, Fiscais, Jurídicas, etc.
   
2. **02_modules.sql** - 3 módulos principais
   - Polícia Federal - Agente
   - Banco do Brasil - Escriturário
   - ENEM - Preparação Completa
   
3. **03_subjects.sql** - 23 matérias
   - 7 matérias para Polícia Federal
   - 6 matérias para Banco do Brasil
   - 10 matérias para ENEM
   
4. **04_plans.sql** - 5 planos de assinatura
   - Gratuito (R$ 0,00)
   - Carreira Bancária (R$ 39,90)
   - ENEM/Vestibular (R$ 44,90)
   - Carreira Policial (R$ 49,90)
   - PRO - Acesso Total (R$ 99,90)

### Opção Rápida: Run All

Você pode executar todos os seeds de uma vez:

```sql
\i supabase/seed/00_run_all.sql
```

## Via Supabase Dashboard

1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Crie uma nova query
4. Cole o conteúdo de cada arquivo (na ordem)
5. Execute (Run)

## Resultado Esperado

Após executar todos os seeds, você terá:
- ✅ 14 categorias
- ✅ 3 módulos
- ✅ 23 matérias
- ✅ 5 planos
- ✅ Vínculos entre planos e módulos

## Estrutura dos Dados

### Categorias
- 14 categorias cobrindo principais áreas de concursos
- Cada categoria tem: nome, descrição, ícone, cor, flag premium

### Módulos
- Cada módulo pertence a uma categoria
- Polícia Federal → categoria policiais
- Banco do Brasil → categoria bancarias  
- ENEM → categoria enem_vestibular

### Matérias
- Cada matéria pertence a um módulo
- Inclui estimativa de horas de estudo
- Ordenadas por prioridade

### Planos
- 5 planos com diferentes níveis de acesso
- Planos modulares (1 plano por carreira)
- Plano PRO com acesso total
- Vínculos automáticos com módulos via plan_modules

## Dados Adicionais

Para adicionar mais módulos ou categorias, use o mesmo padrão dos arquivos existentes.

### Exemplo: Adicionar novo módulo

```sql
-- Adicionar categoria (se necessário)
INSERT INTO public.categories (name, description, icon, color, is_premium, "order")
VALUES ('nova_categoria', 'Descrição', 'icon-name', 'primary', true, 15);

-- Adicionar módulo
INSERT INTO public.modules (category_id, name, description, "order")
SELECT id, 'Nome do Módulo', 'Descrição completa', 1
FROM public.categories WHERE name = 'nova_categoria';

-- Adicionar matérias
INSERT INTO public.subjects (module_id, name, estimated_hours, "order")
SELECT m.id, 'Nome da Matéria', 40, 1
FROM public.modules m
JOIN public.categories c ON m.category_id = c.id
WHERE c.name = 'nova_categoria';
```

## Observações

- Todos os IDs são UUIDs gerados automaticamente
- As queries usam JOINs para encontrar IDs automaticamente
- Não é necessário hardcoding de UUIDs
- Tabelas usam timestamps automáticos (created_at, updated_at)
