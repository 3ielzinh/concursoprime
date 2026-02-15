# 📋 TODO - Concurso PRO

Checklist de implementação do projeto.

## 🔴 PRIORIDADE 1 - Setup Inicial

- [x] Criar projeto Next.js
- [x] Instalar Supabase
- [x] Instalar shadcn/ui
- [x] Criar schema do banco
- [x] Criar scripts de seed
- [ ] **Criar conta Supabase**
- [ ] **Executar schema.sql**
- [ ] **Executar seeds**
- [ ] **Configurar .env.local**

## 🟠 PRIORIDADE 2 - Autenticação

### Páginas
- [ ] `app/(auth)/layout.tsx` - Layout auth
- [ ] `app/(auth)/login/page.tsx` - Página de login
- [ ] `app/(auth)/register/page.tsx` - Página de registro
- [ ] `app/auth/callback/route.ts` - Callback OAuth

### Features
- [ ] Formulário de login com validação
- [ ] Formulário de registro com validação
- [ ] Login com email/senha
- [ ] Registro com email/senha
- [ ] Verificação de email
- [ ] Recuperação de senha
- [ ] Mensagens de erro/sucesso
- [ ] Redirect após login

### Estilização
- [ ] Dark mode toggle
- [ ] Gradientes modernos
- [ ] Animações suaves
- [ ] Responsivo mobile

## 🟡 PRIORIDADE 3 - Dashboard Base

### Layout
- [ ] `app/(dashboard)/layout.tsx` - Layout principal
- [ ] Sidebar com navegação
- [ ] Header com user menu
- [ ] Footer
- [ ] Mobile menu (hamburger)

### Sidebar
- [ ] Tema verde esmeralda (#3cb371 → #2e8b57)
- [ ] Texto branco
- [ ] Ícones das seções
- [ ] Navegação:
  - Dashboard
  - Módulos
  - Meu Progresso
  - Cronograma
  - Assinatura
  - Configurações

### Dashboard Home
- [ ] `app/(dashboard)/dashboard/page.tsx`
- [ ] Cards de estatísticas:
  - Total de horas estudadas
  - Matérias estudadas
  - Sessões de estudo
  - Meta semanal
- [ ] Gráfico de progresso
- [ ] Últimas sessões de estudo
- [ ] Módulos em andamento

## 🟢 PRIORIDADE 4 - Módulos e Matérias

### Listagem
- [ ] `app/(dashboard)/modules/page.tsx` - Lista de módulos
- [ ] Cards de módulos com:
  - Imagem/ícone
  - Nome
  - Categoria
  - Número de matérias
  - Progresso (se aplicável)
- [ ] Filtro por categoria
- [ ] Busca por nome
- [ ] Badge de "Premium"

### Detalhes do Módulo
- [ ] `app/(dashboard)/modules/[id]/page.tsx`
- [ ] Informações do módulo
- [ ] Lista de matérias
- [ ] Tempo estimado total
- [ ] Botão "Iniciar Estudo"
- [ ] Progresso por matéria

### Matérias
- [ ] `app/(dashboard)/subjects/[id]/page.tsx`
- [ ] Conteúdo da matéria
- [ ] Timer de estudo
- [ ] Botão "Marcar como concluída"
- [ ] Anotações pessoais

## 🔵 PRIORIDADE 5 - Sistema de Estudo

### Sessões de Estudo
- [ ] `app/(dashboard)/study/page.tsx`
- [ ] Timer de sessão
- [ ] Seleção de matéria
- [ ] Anotações durante estudo
- [ ] Salvar sessão automaticamente
- [ ] Histórico de sessões

### Cronograma
- [ ] `app/(dashboard)/schedule/page.tsx`
- [ ] Criar cronograma
- [ ] Editar cronograma
- [ ] Visualização de calendário
- [ ] Notificações de tarefas
- [ ] Marcar como concluído

## 🟣 PRIORIDADE 6 - Assinaturas

### Planos
- [ ] `app/(dashboard)/plans/page.tsx`
- [ ] Cards dos 5 planos:
  - Gratuito (R$ 0)
  - Carreira Bancária (R$ 39,90)
  - ENEM/Vestibular (R$ 44,90)
  - Carreira Policial (R$ 49,90)
  - PRO (R$ 99,90)
- [ ] Comparação de features
- [ ] Botão "Assinar" / "Upgrade"
- [ ] Badge do plano atual

### Assinatura Atual
- [ ] `app/(dashboard)/subscription/page.tsx`
- [ ] Detalhes do plano atual
- [ ] Data de renovação
- [ ] Histórico de pagamentos
- [ ] Upgrade/Downgrade
- [ ] Cancelar assinatura

### Integração de Pagamento
- [ ] Escolher gateway (Stripe/PagSeguro/Mercado Pago)
- [ ] Configurar webhooks
- [ ] Processar pagamentos
- [ ] Atualizar subscriptions automaticamente
- [ ] Notificações de cobrança

## 🟤 PRIORIDADE 7 - Perfil do Usuário

### Página de Perfil
- [ ] `app/(dashboard)/profile/page.tsx`
- [ ] Editar informações:
  - Nome
  - Email
  - Avatar
  - Bio
- [ ] Upload de avatar
- [ ] Alterar senha
- [ ] Configurações de notificações
- [ ] Dark mode toggle

### Estatísticas Pessoais
- [ ] Total de horas estudadas
- [ ] Matérias concluídas
- [ ] Sequência de dias (streak)
- [ ] Gráficos de progresso

## ⚫ PRIORIDADE 8 - Admin Panel

### User Management
- [ ] `app/(dashboard)/admin/users/page.tsx`
- [ ] Lista de usuários
- [ ] Buscar usuários
- [ ] Ver detalhes do usuário
- [ ] Editar usuário
- [ ] Atribuir plano manualmente
- [ ] Adicionar notas administrativas
- [ ] Ver logs de acesso

### Content Management
- [ ] CRUD de categorias
- [ ] CRUD de módulos
- [ ] CRUD de matérias
- [ ] CRUD de planos
- [ ] Upload de imagens

### Analytics
- [ ] Dashboard de métricas
- [ ] Usuários ativos
- [ ] Assinaturas por plano
- [ ] Módulos mais estudados
- [ ] Exportar relatórios

## 🎨 PRIORIDADE 9 - UI/UX

### Componentes shadcn
- [ ] Button
- [ ] Card
- [ ] Form
- [ ] Input
- [ ] Select
- [ ] Dialog
- [ ] Dropdown
- [ ] Tabs
- [ ] Toast
- [ ] Progress
- [ ] Badge
- [ ] Avatar
- [ ] Calendar

### Dark Mode
- [ ] Toggle no header
- [ ] Persistir preferência
- [ ] Transição suave
- [ ] Cores otimizadas

### Temas
- [ ] Verde esmeralda na sidebar
- [ ] Paleta de cores consistente
- [ ] Design system documentado

### Responsividade
- [ ] Mobile first
- [ ] Tablet otimizado
- [ ] Desktop full experience

## 🚀 PRIORIDADE 10 - Deploy

### Preparação
- [ ] Build sem erros
- [ ] Testes de produção
- [ ] Otimização de imagens
- [ ] SEO meta tags
- [ ] Favicon e manifest

### Netlify
- [ ] Conectar repositório
- [ ] Configurar variáveis de ambiente
- [ ] Build settings:
  - Command: `npm run build`
  - Directory: `.next`
- [ ] Domínio customizado
- [ ] SSL habilitado

### Supabase Produção
- [ ] Projeto de produção criado
- [ ] Schema executado
- [ ] Seeds executados
- [ ] URLs de redirect configuradas
- [ ] Row Level Security validado

## 🔧 EXTRAS

### Features Adicionais
- [ ] Modo offline (PWA)
- [ ] Notificações push
- [ ] Exportar dados (PDF)
- [ ] Calendário integrado
- [ ] Gamificação (badges, níveis)
- [ ] Fórum de discussão
- [ ] Chat de suporte
- [ ] Flashcards
- [ ] Questões e simulados

### Melhorias
- [ ] Cache com React Query
- [ ] Lazy loading de componentes
- [ ] Skeleton loaders
- [ ] Error boundaries
- [ ] Logger estruturado
- [ ] Monitoramento (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] A/B testing

### Documentação
- [ ] Storybook de componentes
- [ ] Docs de API
- [ ] Guia de contribuição
- [ ] Changelog

## 📊 Progresso Geral

- [x] Setup (100%)
- [ ] Autenticação (0%)
- [ ] Dashboard (0%)
- [ ] Módulos (0%)
- [ ] Estudo (0%)
- [ ] Assinaturas (0%)
- [ ] Perfil (0%)
- [ ] Admin (0%)
- [ ] UI/UX (20% - shadcn configurado)
- [ ] Deploy (0%)

---

**Última atualização:** 2025
**Status:** 🟢 Pronto para desenvolvimento
