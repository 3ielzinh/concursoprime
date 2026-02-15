# 🎯 Concurso PRO

Plataforma moderna de preparação para concursos públicos e vestibulares, construída com Next.js 14, TypeScript e Supabase.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 + shadcn/ui
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Deploy:** Netlify / Vercel

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd concurso-pro
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1. Crie uma conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização
3. Crie um novo projeto
4. Anote: **URL** e **anon key**

#### 3.2. Configure as variáveis de ambiente

Copie o arquivo `.env.local` e preencha com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

#### 3.3. Execute o schema do banco de dados

1. Acesse o **SQL Editor** no dashboard do Supabase
2. Cole o conteúdo de `supabase/schema.sql`
3. Execute o script (Run)
4. Verifique se todas as tabelas foram criadas

#### 3.4. Popule os dados iniciais

Execute os scripts de seed na ordem:

1. `supabase/seed/01_categories.sql` (14 categorias)
2. `supabase/seed/02_modules.sql` (3 módulos)
3. `supabase/seed/03_subjects.sql` (23 matérias)
4. `supabase/seed/04_plans.sql` (5 planos)

Ou execute todos de uma vez:
```sql
\i supabase/seed/00_run_all.sql
```

Consulte `supabase/seed/README.md` para mais detalhes.

#### 3.5. Configure a autenticação

No Supabase Dashboard:
1. Vá em **Authentication** → **URL Configuration**
2. Adicione as URLs de redirect:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** 
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.com` (produção)
     - `https://seu-dominio.com/auth/callback` (produção)

### 4. Execute o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Estrutura do Projeto

```
concurso-pro/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas de autenticação (login, register)
│   ├── (dashboard)/       # Rotas protegidas (dashboard)
│   └── page.tsx           # Página inicial
├── components/            # Componentes React reutilizáveis
│   └── ui/               # Componentes shadcn/ui
├── lib/
│   └── supabase/         # Clientes Supabase
│       ├── client.ts     # Cliente browser
│       ├── server.ts     # Cliente server
│       └── middleware.ts # Middleware de auth
├── supabase/
│   ├── schema.sql        # Schema do banco de dados
│   └── seed/             # Scripts de dados iniciais
├── types/
│   └── database.types.ts # Types TypeScript do banco
├── middleware.ts          # Middleware Next.js
└── .env.local            # Variáveis de ambiente
```

## 🎨 Features

### Implementadas
- ✅ Estrutura do projeto Next.js
- ✅ Integração com Supabase
- ✅ Schema do banco de dados completo
- ✅ Sistema de autenticação (infraestrutura)
- ✅ Middleware de proteção de rotas
- ✅ TypeScript types gerados

### A implementar
- [ ] Páginas de login e registro
- [ ] Dashboard com estatísticas
- [ ] Listagem de módulos e matérias
- [ ] Sistema de assinatura
- [ ] Tracking de estudo (sessões)
- [ ] Gerenciamento de cronograma
- [ ] Painel administrativo
- [ ] Dark mode com toggle
- [ ] Sidebar com tema verde esmeralda

## 📊 Modelo de Dados

### Principais Entidades

- **profiles:** Usuários estendidos (vinculado a auth.users)
- **categories:** Categorias de concursos (Policiais, Bancários, etc.)
- **modules:** Módulos de estudo por categoria
- **subjects:** Matérias dentro de cada módulo
- **plans:** Planos de assinatura (Gratuito, Carreira, PRO)
- **subscriptions:** Assinaturas ativas dos usuários
- **study_sessions:** Sessões de estudo registradas
- **schedules:** Cronogramas de estudo

Veja `supabase/schema.sql` para detalhes completos.

## 🔒 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso baseadas em auth.uid()
- Triggers automáticos para perfis e timestamps
- Validação de permissões no backend

## 🚀 Deploy

### Netlify

1. Conecte seu repositório no Netlify
2. Configure as variáveis de ambiente (SUPABASE_URL, etc.)
3. Build command: `npm run build`
4. Publish directory: `.next`

### Vercel

```bash
vercel --prod
```

Configure as variáveis de ambiente no dashboard da Vercel.

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação do [Next.js](https://nextjs.org/docs)
2. Consulte a documentação do [Supabase](https://supabase.com/docs)
3. Abra uma issue no repositório
