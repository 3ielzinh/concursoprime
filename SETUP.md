# 🚀 Setup Rápido - Concurso PRO

Guia rápido para começar a desenvolver.

## ⚡ Quick Start (5 minutos)

### 1. Instale dependências
```bash
npm install
```

### 2. Configure Supabase

#### Crie projeto Supabase:
1. Acesse https://supabase.com
2. New Project
3. Copie URL e anon key

#### Configure .env.local:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### 3. Setup do banco

No Supabase SQL Editor, execute na ordem:

```sql
-- 1. Schema (cria tabelas)
-- Cole: supabase/schema.sql

-- 2. Dados iniciais (popula)
-- Cole: supabase/seed/00_run_all.sql
```

### 4. Configure Auth

No Supabase → Authentication → URL Configuration:
- Site URL: `http://localhost:3000`
- Redirect: `http://localhost:3000/auth/callback`

### 5. Run!
```bash
npm run dev
```

Acesse: http://localhost:3000

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Conta no Supabase criada
- [ ] Projeto no Supabase criado
- [ ] `npm install` executado
- [ ] `.env.local` configurado
- [ ] `schema.sql` executado no Supabase
- [ ] Scripts seed executados
- [ ] URLs de redirect configuradas
- [ ] `npm run dev` rodando
- [ ] Página abre em localhost:3000

## 🔍 Verificação

Execute no SQL Editor do Supabase:

```sql
-- Deve retornar 14
SELECT COUNT(*) FROM categories;

-- Deve retornar 3
SELECT COUNT(*) FROM modules;

-- Deve retornar 23
SELECT COUNT(*) FROM subjects;

-- Deve retornar 5
SELECT COUNT(*) FROM plans;
```

## 📝 Próximos Passos

Após o setup, você pode começar a desenvolver:

1. **Autenticação:**
   - [ ] Criar `app/(auth)/login/page.tsx`
   - [ ] Criar `app/(auth)/register/page.tsx`
   - [ ] Criar `app/auth/callback/route.ts`

2. **Dashboard:**
   - [ ] Criar `app/(dashboard)/layout.tsx`
   - [ ] Criar `app/(dashboard)/dashboard/page.tsx`
   - [ ] Criar sidebar com tema verde esmeralda

3. **Módulos:**
   - [ ] Criar `app/(dashboard)/modules/page.tsx`
   - [ ] Criar `app/(dashboard)/modules/[id]/page.tsx`

4. **UI Components:**
   - [ ] Instalar componentes shadcn necessários
   - [ ] Criar dark mode toggle
   - [ ] Criar layout base

## 🆘 Problemas Comuns

### Erro: Supabase URL não definida
```
Solution: Verifique .env.local e reinicie o servidor
```

### Erro: Tabelas não existem
```
Solution: Execute supabase/schema.sql no SQL Editor
```

### Erro: Redirect URL mismatch
```
Solution: Configure URLs em Authentication → URL Configuration
```

### Build error no Netlify
```
Solution: Configure variáveis de ambiente no dashboard Netlify
```

## 📚 Referências Rápidas

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
