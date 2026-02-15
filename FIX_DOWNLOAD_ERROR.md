# 🔴 ERRO 404: "Object not found" no Download de PDFs

## 🎯 Problema

Ao clicar para baixar um PDF, aparece uma tela preta com:
```json
{"statusCode":"404","error":"not_found","message":"Object not found"}
```

## 🔍 Causa Raiz

O bucket do Supabase Storage não está configurado como **público**, ou as políticas de acesso (RLS) não estão permitindo leitura pública dos arquivos.

---

## ✅ SOLUÇÃO RÁPIDA (Recomendada)

### Passo 1: Execute o Script de Correção

1. Abra o **Supabase Dashboard**: https://app.supabase.com
2. Vá em **SQL Editor** (menu lateral esquerdo)
3. Abra o arquivo: **`supabase/FIX_STORAGE.sql`** (acabei de criar)
4. Execute TODO o conteúdo do arquivo

O script vai:
- ✅ Verificar se o bucket existe
- ✅ Tornar o bucket público
- ✅ Criar políticas de acesso corretas
- ✅ Mostrar diagnóstico completo

### Passo 2: Verificar Resultado

Após executar o script, você deve ver na saída:

```
✅ Bucket configurado | materials | ✅ PÚBLICO
✅ Política: Public read access | Acesso PÚBLICO
✅ Política: Authenticated users can upload | 🔒 Apenas AUTENTICADOS
```

Se viu essas mensagens, **o problema está corrigido!** 🎉

### Passo 3: Testar Download

1. Volte para a aplicação
2. Pressione **Ctrl + Shift + R** (força recarregar sem cache)
3. Tente baixar um PDF novamente
4. Deve funcionar! ✅

---

## 🛠️ SOLUÇÃO MANUAL (Se preferir fazer pela interface)

### Opção A: Tornar Bucket Público

1. Acesse **Supabase Dashboard** → **Storage**
2. Clique no bucket **"materials"**
3. Clique em **"Settings"** (ícone de engrenagem)
4. Ative a opção **"Public bucket"**
5. Salve

### Opção B: Criar Políticas de Acesso

1. No bucket **"materials"**, vá na aba **"Policies"**
2. Clique em **"New Policy"**
3. Escolha **"For full customization"**

#### Política 1: Leitura Pública (OBRIGATÓRIA)
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'materials'`
- Clique em **"Review"** → **"Save policy"**

#### Política 2: Upload Autenticado
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `bucket_id = 'materials'`
- Clique em **"Review"** → **"Save policy"**

---

## 🔍 DIAGNÓSTICO: Identificar o Problema

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- 1. Verificar se bucket existe e está público
SELECT name, public FROM storage.buckets WHERE name = 'materials';
-- DEVE RETORNAR: public = true
-- ❌ SE public = false: Bucket não está público (execute FIX_STORAGE.sql)

-- 2. Verificar políticas
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND (qual::text LIKE '%materials%' OR with_check::text LIKE '%materials%');
-- DEVE RETORNAR: Pelo menos 1 política com SELECT e roles = {public}
-- ❌ SE VAZIO: Não há políticas (execute FIX_STORAGE.sql)

-- 3. Verificar arquivos
SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'materials';
-- DEVE RETORNAR: Número > 0
-- ❌ SE 0: Não há arquivos (faça upload novamente)
```

---

## 🐛 Problemas Comuns

### ❌ Problema 1: Bucket não existe
**Erro**: `Bucket not found`  
**Solução**: Execute `FIX_STORAGE.sql` (seção 3️⃣)

### ❌ Problema 2: Bucket está privado
**Sintoma**: public = false  
**Solução**: Execute `FIX_STORAGE.sql` (seção 4️⃣)

### ❌ Problema 3: Sem políticas de acesso
**Sintoma**: Download retorna 404  
**Solução**: Execute `FIX_STORAGE.sql` (seção 5️⃣)

### ❌ Problema 4: URLs erradas no banco
**Sintoma**: URL não começa com `https://`  
**Solução**: Execute `FIX_STORAGE.sql` (seção 8️⃣ e 9️⃣)

### ❌ Problema 5: Cache do navegador
**Sintoma**: Erro persiste mesmo após correção  
**Solução**: Pressione **Ctrl + Shift + Del** → Limpar cache → Tentar novamente

---

## 🎯 Checklist Final

Antes de dar o problema como resolvido, confirme:

- [ ] Bucket `materials` existe
- [ ] Bucket está marcado como **público** (public = true)
- [ ] Existe política permitindo **SELECT público**
- [ ] Há arquivos no storage (`SELECT COUNT(*)...`)
- [ ] As URLs dos materiais começam com `https://`
- [ ] Testou em uma **aba anônima** do navegador
- [ ] Forçou reload com **Ctrl + Shift + R**

---

## 🚀 Após Correção

1. **Recarregue a aplicação**: Ctrl + Shift + R
2. **Teste o download**: Clique em qualquer PDF
3. **Se funcionar**: Problema resolvido! 🎉
4. **Se ainda der erro**: 
   - Copie a URL completa do PDF que está dando erro
   - Tente acessar a URL diretamente no navegador
   - Verifique se a URL está no formato: `https://[projeto].supabase.co/storage/v1/object/public/materials/[modulo]/[arquivo].pdf`

---

## 📊 URLs Corretas vs Incorretas

### ✅ URL Correta:
```
https://abcdefg.supabase.co/storage/v1/object/public/materials/policiais/1234567890-arquivo.pdf
```

### ❌ URL Incorreta:
```
https://abcdefg.supabase.co/storage/v1/object/materials/policiais/1234567890-arquivo.pdf
                                              ↑
                                        Falta "public/"
```

Se suas URLs não têm `/public/`, você precisa:
1. Tornar o bucket público
2. Fazer novo upload dos arquivos
3. OU atualizar as URLs no banco (veja seção 9️⃣ do FIX_STORAGE.sql)

---

## ❓ Ainda com problemas?

Se após seguir todos os passos o erro persistir:

1. Execute este SQL e copie o resultado:
```sql
SELECT 
  name,
  public,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'materials') as total_arquivos,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') as total_policies
FROM storage.buckets 
WHERE name = 'materials';
```

2. Copie também uma URL completa de PDF que está dando erro
3. Copie a resposta exata do erro (o JSON completo)

Com essas informações posso te ajudar melhor! 🎯
