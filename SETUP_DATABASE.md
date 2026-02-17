# 🗄️ Setup do Banco de Dados

Este guia explica como configurar o banco de dados Supabase para que o projeto funcione corretamente com **múltiplos usuários** e **persistência de dados**.

## 📋 Pré-requisitos

- Conta no Supabase (https://supabase.com)
- Projeto criado no Supabase
- Credenciais configuradas no arquivo `.env.local`

## 🚀 Passos para Configuração

### 1. Acessar o SQL Editor

1. Acesse seu projeto no Supabase
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query** para criar uma nova query

### 2. Executar Schema Principal

Copie e cole o conteúdo do arquivo `supabase/schema.sql` no SQL Editor e execute.

Este comando criará todas as tabelas necessárias:
- `profiles` - Perfis de usuários
- `categories` - Categorias de módulos
- `modules` - Módulos de estudo
- `subjects` - Matérias/assuntos
- `plans` - Planos de assinatura
- `subscriptions` - Assinaturas dos usuários
- `study_sessions` - Sessões de estudo
- `schedules` - Cronogramas de estudo
- E outras tabelas auxiliares

### 3. Executar Migrações

Execute as migrações na ordem correta:

#### **Migração 001** - Adicionar subject_name em study_sessions
```bash
Arquivo: supabase/migrations/001_add_subject_name.sql
```

Esta migração permite que os usuários registrem sessões de estudo com nomes de matérias em texto livre (não apenas referências a matérias cadastradas).

#### **Migração 002** - Módulos e Materiais
```bash
Arquivo: supabase/migrations/002_modules_and_materials.sql
```

Esta migração adiciona suporte para materiais de estudo (PDFs, vídeos, etc.).

#### **Migração 003** - Atualizar tabela schedules
```bash
Arquivo: supabase/migrations/003_update_schedules.sql
```

Esta migração adiciona campos necessários para o cronograma funcionar corretamente:
- `subject_name` - Nome da matéria em texto livre
- `color` - Cor do bloco no cronograma
- Índices para melhorar performance

### 4. Configurar Políticas RLS (Row Level Security)

Execute o seguinte SQL para permitir que cada usuário acesse **apenas seus próprios dados**:

```sql
-- Políticas para study_sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias sessões"
ON public.study_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias sessões"
ON public.study_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias sessões"
ON public.study_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias sessões"
ON public.study_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para schedules
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios cronogramas"
ON public.schedules FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios cronogramas"
ON public.schedules FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios cronogramas"
ON public.schedules FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios cronogramas"
ON public.schedules FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios perfis"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Permitir leitura pública de categories, modules, subjects
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categorias são visíveis para todos usuários autenticados"
ON public.categories FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Módulos são visíveis para todos usuários autenticados"
ON public.modules FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matérias são visíveis para todos usuários autenticados"
ON public.subjects FOR SELECT
TO authenticated
USING (true);
```

### 5. Criar Trigger para Perfis

Execute este SQL para criar automaticamente um perfil quando um novo usuário se cadastra:

```sql
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
```

## ✅ Verificação

Após executar todos os scripts, verifique se:

1. ✅ Todas as tabelas foram criadas sem erros
2. ✅ As políticas RLS estão ativas
3. ✅ O trigger de criação de perfil está funcionando

Para testar:
1. Faça login no aplicativo
2. Registre uma sessão de estudo em `/dashboard/study`
3. Crie um cronograma em `/dashboard/schedule`
4. Recarregue a página e verifique se os dados persistem
5. Faça logout e login com outro usuário - os dados devem ser independentes

## 🔐 Segurança Multi-Usuário

Com as políticas RLS configuradas:

- ✅ Cada usuário vê **apenas seus próprios dados**
- ✅ Não é possível acessar dados de outros usuários
- ✅ Inserções/atualizações são limitadas ao próprio usuário
- ✅ Os dados são completamente isolados por `user_id`

## 🆘 Problemas Comuns

### "relation does not exist"
Execute o schema principal (`supabase/schema.sql`) primeiro.

### "column does not exist"
Execute as migrações na ordem correta (001, 002, 003).

### "permission denied"
Verifique se as políticas RLS foram criadas corretamente.

### Dados não aparecem após recarregar
Verifique:
1. Se o usuário está autenticado
2. Se as políticas RLS estão ativas
3. Se o `user_id` está sendo salvo corretamente

## 📚 Dados Iniciais (Opcional)

Para popular o banco com dados de exemplo, execute os scripts em `supabase/seed/`:

```bash
supabase/seed/00_run_all.sql
```

Ou individualmente:
- `01_categories.sql` - Categorias de concursos
- `02_modules.sql` - Módulos de estudo
- `03_subjects.sql` - Matérias
- `04_plans.sql` - Planos de assinatura

---

**Pronto!** Agora seu banco de dados está configurado para suportar múltiplos usuários com dados persistentes e isolados. 🎉
