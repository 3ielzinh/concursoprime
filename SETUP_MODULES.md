# Configuração de Módulos e Materiais - Supabase

## 📋 Passo 1: Criar Tabelas no Banco de Dados

1. Acesse o **Supabase Dashboard**: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Copie e cole o conteúdo do arquivo `supabase/migrations/002_modules_and_materials.sql`
5. Clique em **Run** para executar a migração

Isso irá criar:
- ✅ Tabela `modules` (14 módulos pré-cadastrados)
- ✅ Tabela `materials` (vazia, para adicionar PDFs)
- ✅ Índices para performance
- ✅ RLS (Row Level Security) configurado

---

## 📦 Passo 2: Configurar Supabase Storage

### 2.1 Criar Bucket para Materiais

1. No Supabase Dashboard, vá em **Storage** (menu lateral)
2. Clique em **New Bucket**
3. Configure:
   - **Name:** `materials`
   - **Public bucket:** ✅ Marque como público (para permitir downloads diretos)
   - **File size limit:** 50 MB (ajuste conforme necessário)
   - **Allowed MIME types:** `application/pdf`, `video/mp4` (adicione outros tipos se necessário)
4. Clique em **Create bucket**

### 2.2 Configurar Políticas de Acesso

Após criar o bucket, configure as políticas:

1. Clique no bucket `materials`
2. Vá na aba **Policies**
3. Adicione as seguintes políticas:

#### Política de Leitura (Download - Público)
```sql
CREATE POLICY "Public Access to Materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials');
```

#### Política de Upload (Admin apenas)
```sql
CREATE POLICY "Authenticated users can upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');
```

#### Política de Deleção (Admin apenas)
```sql
CREATE POLICY "Authenticated users can delete materials"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'materials');
```

---

## 📤 Passo 3: Fazer Upload de PDFs

### Opção A: Via Supabase Dashboard (Rápido para testes)

1. Vá em **Storage** → **materials**
2. Crie subpastas para cada módulo:
   - `policiais/`
   - `militares/`
   - `fiscais/`
   - (etc...)
3. Clique em **Upload file**
4. Selecione seus PDFs
5. Após upload, copie a URL pública do arquivo

### Opção B: Via Código (Recomendado para produção)

Criar página de admin para upload (a fazer):
- `app/(dashboard)/admin/materials/page.tsx`
- Formulário com seleção de módulo e arquivo
- Upload automático para o Storage
- Criação automática de registro na tabela `materials`

---

## 🔗 Passo 4: Adicionar Materiais ao Banco de Dados

Após fazer upload dos PDFs, registre-os na tabela `materials`:

```sql
-- Exemplo: Adicionar PDF de Direito Constitucional para Carreiras Policiais

INSERT INTO public.materials (
  module_id,
  title,
  description,
  type,
  file_url,
  file_size,
  pages,
  is_free,
  display_order
)
SELECT 
  id,
  'Direito Constitucional - Apostila Completa',
  'Material completo sobre Direito Constitucional para carreiras policiais',
  'pdf',
  'https://pvugplqtptiuwblgcnek.supabase.co/storage/v1/object/public/materials/policiais/constitucional.pdf',
  '2.5 MB',
  120,
  false,
  1
FROM public.modules WHERE slug = 'policiais';
```

**Template para adicionar múltiplos materiais:**

```sql
-- Substitua os valores entre <> pelos dados reais

INSERT INTO public.materials (
  module_id,
  title,
  description,
  type,
  file_url,
  file_size,
  pages,
  is_free,
  display_order
)
SELECT 
  (SELECT id FROM public.modules WHERE slug = '<SLUG_DO_MODULO>'),
  '<TITULO_DO_MATERIAL>',
  '<DESCRICAO_OPCIONAL>',
  'pdf',
  '<URL_PUBLICA_DO_ARQUIVO>',
  '<TAMANHO_EX_2.5MB>',
  <NUMERO_DE_PAGINAS>,
  false,
  <ORDEM_DE_EXIBICAO>
;
```

---

## 🔄 Passo 5: Atualizar o Código da Aplicação

A página `app/(dashboard)/modules/[slug]/page.tsx` já está criada com **dados mockados**.

Para usar dados reais do Supabase, substitua a seção de mock por:

```tsx
// Buscar módulo e materiais do banco
const { data: module } = await supabase
  .from('modules')
  .select('*')
  .eq('slug', slug)
  .single()

if (!module) {
  return <div>Módulo não encontrado</div>
}

const { data: materials } = await supabase
  .from('materials')
  .select('*')
  .eq('module_id', module.id)
  .order('display_order', { ascending: true })
```

---

## ✅ Checklist de Implementação

- [ ] Executar migração SQL (`002_modules_and_materials.sql`)
- [ ] Criar bucket `materials` no Supabase Storage
- [ ] Configurar políticas de acesso (SELECT público, INSERT/DELETE autenticados)
- [ ] Criar estrutura de pastas no Storage (policiais/, militares/, etc.)
- [ ] Fazer upload de PDFs de teste
- [ ] Inserir registros na tabela `materials` via SQL
- [ ] Atualizar `modules/[slug]/page.tsx` para buscar dados reais
- [ ] Testar acesso aos módulos e download de PDFs
- [ ] (Opcional) Criar página de admin para gerenciar materiais

---

## 📝 Notas Importantes

1. **URLs Públicas:** Use sempre URLs completas do Storage:
   ```
   https://<PROJECT_ID>.supabase.co/storage/v1/object/public/materials/<path>
   ```

2. **Tamanhos de Arquivo:** Calcule o tamanho real ou use aproximações:
   - 1 MB = 1.024 KB
   - Exemplo: arquivo de 2.567.890 bytes = ~2.5 MB

3. **Número de Páginas:** Use ferramentas como:
   - Adobe Reader (Propriedades do arquivo)
   - PDFtk: `pdftk file.pdf dump_data | grep NumberOfPages`
   - Python: `PyPDF2.PdfReader(file).getNumPages()`

4. **Performance:** Os índices criados otimizam consultas por:
   - `slug` (busca de módulo)
   - `module_id` (materiais de um módulo)
   - `type` (filtrar por tipo de material)

5. **Segurança RLS:** 
   - Todos podem **ler** módulos e materiais
   - Apenas usuários autenticados podem **criar/editar/deletar**
   - Para restringir ainda mais, adicione verificação de `is_premium` ou roles de admin

---

## 🚀 Próximos Passos

Após configurar o banco e storage:

1. **Integração com PDF.js:** Visualizar PDFs no modal
   ```bash
   npm install react-pdf pdfjs-dist
   ```

2. **Página de Admin:** Interface para upload e gerenciamento
   - Upload de arquivos
   - Formulário de cadastro de materiais
   - Lista e edição de materiais existentes

3. **Sistema de Progresso:** Rastrear PDFs visualizados/baixados

4. **Busca e Filtros:** Procurar materiais por nome, tipo, módulo

5. **Analytics:** Rastrear downloads e visualizações mais populares
