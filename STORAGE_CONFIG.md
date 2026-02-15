# 🔧 Configuração do Supabase Storage para Upload de PDFs

## ⚠️ Erro: "Bucket não encontrado" ou falha em todos os uploads

Se você está vendo **74 erros** no upload, significa que o **bucket do Supabase Storage não está configurado**.

---

## 📦 Passo a Passo: Criar Bucket "materials"

### 1. Acesse o Supabase Dashboard

🔗 **URL:** https://app.supabase.com

Faça login e selecione seu projeto.

### 2. Vá para Storage

No menu lateral esquerdo, clique em **"Storage"**

### 3. Crie o Bucket

1. Clique no botão **"New Bucket"** (ou "Create bucket")

2. Preencha os dados:
   - **Name:** `materials` (exatamente assim, sem maiúsculas)
   - **Public bucket:** ✅ **MARQUE esta opção** (muito importante!)
   - **File size limit:** `50` MB (ou mais se tiver PDFs grandes)
   - **Allowed MIME types:** `application/pdf` (opcional, mas recomendado)

3. Clique em **"Create bucket"**

### 4. Verificar se foi criado

Você deve ver o bucket `materials` na lista de buckets.

---

## 🔐 Passo 2: Configurar Políticas de Acesso (RLS)

Agora precisa configurar as permissões. Existem 2 formas:

### Opção A: Via Interface (Mais Fácil) ✅

1. Clique no bucket **"materials"** que você acabou de criar

2. Vá na aba **"Policies"** (ou "Configurações")

3. Clique em **"New Policy"**

4. Escolha **"Custom policy"** ou **"Allow public access"**

5. Configure:

**Para LEITURA (Download) - Público:**
- Policy name: `Public Access`
- Policy definition: `SELECT`
- Target roles: `public` ou `anon`
- USING expression: `true`

**Para UPLOAD - Apenas Autenticados:**
- Policy name: `Authenticated Upload`
- Policy definition: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `true`

### Opção B: Via SQL (Mais Rápido) ✅

Se preferir, execute este SQL no **SQL Editor** do Supabase:

```sql
-- Política de LEITURA (público pode baixar)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Política de UPLOAD (apenas autenticados)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Política de DELEÇÃO (apenas autenticados)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'materials');
```

---

## ✅ Passo 3: Testar Configuração

### Teste Manual no Dashboard:

1. Vá em **Storage** → **materials**
2. Tente fazer upload de um arquivo PDF de teste
3. Se funcionar, está configurado corretamente!

### Teste na Aplicação:

1. Faça logout e login novamente (para garantir token atualizado)
2. Vá em `/admin/upload`
3. Selecione um módulo
4. Tente fazer upload de 1 PDF pequeno primeiro
5. Veja a mensagem de erro detalhada

---

## 🐛 Troubleshooting: Erros Comuns

### Erro: "new row violates row-level security policy"
**Causa:** Políticas RLS não configuradas  
**Solução:** Execute o SQL acima (Opção B do Passo 2)

### Erro: "Bucket not found"
**Causa:** Nome do bucket incorreto  
**Solução:** Certifique-se que o bucket se chama exatamente `materials` (minúsculo, sem espaços)

### Erro: "Invalid bucket name"
**Causa:** Bucket não existe  
**Solução:** Crie o bucket seguindo o Passo 1

### Erro: "Policy check violation"
**Causa:** Bucket não está público OU políticas não permitem upload autenticado  
**Solução:** 
1. Marque o bucket como público (edite o bucket)
2. Adicione as políticas de acesso (Passo 2)

### Erro: "File size exceeds limit"
**Causa:** Arquivo muito grande  
**Solução:** Aumente o limite no bucket ou comprima o PDF

### Upload lento ou travando:
**Causa:** Muitos arquivos grandes de uma vez  
**Solução:** Faça upload em lotes menores (5-10 PDFs por vez)

---

## 📊 Verificar se está funcionando

Execute este SQL no **SQL Editor**:

```sql
-- Verificar buckets existentes
SELECT id, name, public 
FROM storage.buckets 
WHERE name = 'materials';

-- Deve retornar 1 linha com:
-- name: materials
-- public: true

-- Verificar políticas
SELECT * 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Deve mostrar as 3 políticas criadas
```

---

## 🎯 Checklist Final

Antes de fazer upload, confirme:

- [ ] Bucket `materials` existe
- [ ] Bucket está marcado como **público** (public = true)
- [ ] Políticas de acesso criadas (SELECT público, INSERT/DELETE autenticado)
- [ ] Você está logado como admin
- [ ] Executou o `SETUP_INICIAL.sql` (tabela modules existe)
- [ ] Fez logout/login após virar admin

---

## 🚀 Após Configurar

1. **Recarregue a página** `/admin/upload`
2. **Tente upload novamente** de 1 arquivo de teste
3. **Veja a mensagem de erro detalhada** (agora mostra o erro específico)
4. Se funcionar, faça upload em lotes de **5-10 PDFs** por vez

---

## 💡 Dicas Adicionais

- **Organize por pastas:** Os arquivos são salvos em `materials/{slug}/arquivo.pdf`
- **Limite de tamanho:** Configure no bucket (recomendado: 50MB)
- **Compressão:** Use ferramentas como SmallPDF ou Adobe Acrobat para comprimir PDFs grandes
- **Performance:** Faça upload durante horários de menos uso para melhor velocidade

---

## ❓ Ainda com problemas?

Execute novamente e **copie a mensagem de erro completa**. Agora o sistema mostra:
- Nome do arquivo que falhou
- Mensagem de erro específica
- Primeiros 3 erros detalhados

Com essa informação posso te ajudar melhor! 🎯
