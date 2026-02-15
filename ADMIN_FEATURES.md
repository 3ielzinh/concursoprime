# 📤 Upload de Materiais e 👥 Gestão de Usuários

## 🎯 Funcionalidades Implementadas

### 1. Upload de PDFs em Lote (`/admin/upload`)

Interface completa para fazer upload de materiais (PDFs) para os módulos do curso.

#### Características:
- ✅ **Upload múltiplo**: Selecione vários PDFs de uma vez
- ✅ **Metadados personalizáveis**: Título, descrição, número de páginas
- ✅ **Cálculo automático de tamanho**: Sistema calcula o tamanho em MB
- ✅ **Seleção de módulo**: Escolha para qual módulo enviar os PDFs
- ✅ **Preview antes do envio**: Visualize e edite metadados antes do upload
- ✅ **Feedback em tempo real**: Acompanhe o progresso e erros
- ✅ **Armazenamento no Supabase Storage**: PDFs salvos no bucket `materials`
- ✅ **Registro automático no banco**: Insere na tabela `materials` com URL pública

#### Como usar:

1. **Acesse** `/admin/upload` (ou clique em "Upload de Materiais" na página de admin)

2. **Selecione o módulo** de destino no dropdown (ex: Carreiras Policiais)

3. **Adicione os PDFs**:
   - Clique na área de upload
   - Selecione múltiplos arquivos (Ctrl/Cmd + Click)
   - Ou arraste e solte os arquivos

4. **Preencha os metadados** de cada PDF:
   - **Título** (obrigatório): Nome do material
   - **Páginas** (opcional): Quantidade de páginas do PDF
   - **Descrição** (opcional): Breve descrição do conteúdo

5. **Clique em "Fazer Upload"**

6. **Aguarde** o upload ser concluído
   - Você verá uma mensagem de sucesso com a quantidade de arquivos enviados
   - Em caso de erro, será informado quais arquivos falharam

#### ⚠️ Pré-requisitos:

Antes de fazer o primeiro upload, você precisa:

1. **Criar o bucket `materials` no Supabase Storage**:
   - Acesse https://app.supabase.com
   - Vá em Storage → New Bucket
   - Nome: `materials`
   - Marque como **público**

2. **Configurar políticas de acesso**:
```sql
-- Permitir leitura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials');

-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');
```

3. **Executar a migração de banco de dados**:
   - Execute o SQL em `supabase/migrations/002_modules_and_materials.sql`
   - Isso cria as tabelas `modules` e `materials`

---

### 2. Gestão de Usuários (`/admin/users`)

Interface completa de administração de usuários com CRUD completo.

#### Características:
- ✅ **Lista de todos os usuários** com paginação
- ✅ **Estatísticas em tempo real**: Total, Premium, Free, Admins
- ✅ **Busca por nome ou username**
- ✅ **Filtros por plano**: Todos, Premium, Free
- ✅ **Toggle rápido de Premium**: Clique no plano para ativar/desativar
- ✅ **Edição completa de perfil**:
  - Username
  - Nome
  - Status Premium
  - Data de expiração do Premium
  - Permissão de Admin
- ✅ **Exclusão de usuários** com confirmação
- ✅ **Responsivo**: Funciona em mobile, tablet e desktop
- ✅ **Feedback visual**: Mensagens de sucesso/erro

#### Como usar:

##### 📊 Visualizar estatísticas
- No topo da página, veja cards com:
  - Total de usuários
  - Membros PRO
  - Usuários Free
  - Administradores

##### 🔍 Buscar usuários
- Digite no campo de busca para filtrar por nome ou username
- Use os botões de filtro (Todos, PRO, Free)

##### 👑 Ativar/Desativar Premium rapidamente
- Clique no texto "👑 PRO" ou "Free" na coluna "Plano"
- O sistema automaticamente:
  - Ativa/desativa o status premium
  - Define data de expiração (+30 dias se ativar)
  - Atualiza a interface

##### ✏️ Editar usuário
1. Clique no ícone ✏️ na linha do usuário
2. Modal abre com campos editáveis:
   - Username
   - Nome
   - Premium até (data)
   - Checkbox Premium
   - Checkbox Admin
3. Faça as alterações
4. Clique em "Salvar"

##### 🗑️ Excluir usuário
1. Clique no ícone 🗑️ na linha do usuário
2. Confirme a exclusão no modal
3. O usuário é removido do banco de dados
   - ⚠️ Ação irreversível!

---

## 📊 Fluxo Completo de Uso

### Para fazer upload de PDFs do Google Drive:

1. **Baixe os PDFs** do Google Drive para seu computador

2. **Acesse** `/admin/upload` na aplicação

3. **Selecione o módulo** (ex: Carreiras Policiais)

4. **Faça upload em lote**:
   - Selecione todos os PDFs do módulo de uma vez
   - Preencha os metadados (título, páginas)
   - Clique em "Fazer Upload"

5. **Repita** para cada módulo

6. **Verifique** acessando `/modules/[slug]` para ver os PDFs

### Para gerenciar usuários:

1. **Acesse** `/admin/users`

2. **Ative premium manualmente**:
   - Encontre o usuário na lista
   - Clique em "Free" → Vira "👑 PRO"
   - Ou clique em ✏️ → Edite a data de expiração

3. **Remova usuários inativos**:
   - Clique em 🗑️
   - Confirme a exclusão

4. **Promova usuários a Admin**:
   - Clique em ✏️
   - Marque "Admin"
   - Clique em "Salvar"

---

## 🔐 Segurança

- ✅ Apenas usuários com `is_staff = true` podem acessar `/admin/*`
- ✅ Upload limitado a arquivos `.pdf`
- ✅ Validações no frontend e backend
- ✅ Exclusão de usuários com confirmação
- ✅ RLS (Row Level Security) configurado no Supabase

---

## 🐛 Troubleshooting

### Erro ao fazer upload:
- **"Bucket não encontrado"**: Crie o bucket `materials` no Supabase Storage
- **"Permissão negada"**: Configure as políticas de acesso no Storage
- **"Módulo não encontrado"**: Execute a migração `002_modules_and_materials.sql`

### Erro ao excluir usuário:
- Se aparecer erro ao deletar do auth, é porque precisa de service_role key
- O usuário será removido do `profiles`, mas pode continuar no `auth.users`
- Para deletar completamente, use o Supabase Dashboard → Authentication → Users

### Upload muito lento:
- Verifique o tamanho dos PDFs (recomendado: < 10MB por arquivo)
- Faça upload em lotes menores (5-10 arquivos por vez)
- Comprima PDFs grandes antes do upload

---

## 📝 Próximas melhorias sugeridas

- [ ] Progress bar visual durante upload
- [ ] Arrastar e soltar arquivos (drag and drop)
- [ ] Compressão automática de PDFs grandes
- [ ] Integração direta com Google Drive API
- [ ] Export de lista de usuários (CSV/Excel)
- [ ] Filtros avançados (data de cadastro, último acesso)
- [ ] Edição em lote de usuários
- [ ] Histórico de ações administrativas
- [ ] Notificações por email para usuários (premium expirado, etc)
