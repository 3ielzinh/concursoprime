# 🎨 Design System - Concurso PRO

Guia de estilo e design system do projeto.

## 🌈 Paleta de Cores

### Verde Esmeralda (Principal)
```css
/* Sidebar Light Mode */
--emerald-light-start: #3cb371;  /* Medium Sea Green */
--emerald-light-end: #2e8b57;    /* Sea Green */

/* Sidebar Dark Mode */
--emerald-dark-start: #2d7a4f;   /* Darker Sea Green */
--emerald-dark-end: #1f5a3a;     /* Very Dark Green */
```

### Cores do Sistema (Tailwind)
```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;
--primary: 142 71% 45%;          /* Emerald */
--primary-foreground: 0 0% 100%;
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 142 71% 45%;             /* Emerald */

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--card: 222.2 84% 4.9%;
--card-foreground: 210 40% 98%;
--popover: 222.2 84% 4.9%;
--popover-foreground: 210 40% 98%;
--primary: 142 71% 45%;           /* Emerald */
--primary-foreground: 0 0% 100%;
--secondary: 217.2 32.6% 17.5%;
--secondary-foreground: 210 40% 98%;
--muted: 217.2 32.6% 17.5%;
--muted-foreground: 215 20.2% 65.1%;
--accent: 217.2 32.6% 17.5%;
--accent-foreground: 210 40% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 210 40% 98%;
--border: 217.2 32.6% 17.5%;
--input: 217.2 32.6% 17.5%;
--ring: 142 71% 45%;              /* Emerald */
```

### Cores Hex Rápidas
```
Emerald Principal: #3cb371
Gradient Start: #3cb371
Gradient End: #2e8b57
Dark Start: #2d7a4f
Dark End: #1f5a3a
White Text: #ffffff
```

## 🎭 Componentes

### Sidebar

#### Light Mode
```tsx
<aside className="sidebar bg-gradient-to-b from-[#3cb371] to-[#2e8b57]">
  <nav className="text-white">
    {/* Links em branco */}
  </nav>
</aside>
```

#### Dark Mode
```tsx
<aside className="sidebar dark:bg-gradient-to-b dark:from-[#2d7a4f] dark:to-[#1f5a3a]">
  <nav className="dark:text-white">
    {/* Links em branco */}
  </nav>
</aside>
```

### Cards de Planos

```tsx
<div className="plan-card border-2 hover:border-emerald-500 transition">
  <div className="plan-header bg-gradient-to-r from-emerald-500 to-emerald-600">
    <h3 className="text-white">Plano PRO</h3>
  </div>
  <div className="plan-features">
    {/* Lista de features */}
  </div>
  <button className="bg-emerald-500 hover:bg-emerald-600 text-white">
    Assinar Agora
  </button>
</div>
```

### Botões

```tsx
{/* Primário - Emerald */}
<button className="bg-emerald-500 hover:bg-emerald-600 text-white">
  Botão Primário
</button>

{/* Secundário */}
<button className="border border-emerald-500 text-emerald-500 hover:bg-emerald-50">
  Botão Secundário
</button>

{/* Danger */}
<button className="bg-red-500 hover:bg-red-600 text-white">
  Excluir
</button>
```

### Badges

```tsx
{/* Premium Badge */}
<span className="badge bg-yellow-400 text-yellow-900">
  ⭐ Premium
</span>

{/* Status Badge */}
<span className="badge bg-emerald-100 text-emerald-800">
  Ativo
</span>
```

## 📐 Tipografia

### Fontes
```css
/* Já configurado via next/font */
font-family: var(--font-geist-sans);
font-family: var(--font-geist-mono); /* Para código */
```

### Tamanhos
```css
.text-hero: 3rem (48px)
.text-h1: 2.5rem (40px)
.text-h2: 2rem (32px)
.text-h3: 1.5rem (24px)
.text-body: 1rem (16px)
.text-small: 0.875rem (14px)
.text-xs: 0.75rem (12px)
```

## 🖼️ Ícones

### Biblioteca Recomendada
- **lucide-react** (já instalado via shadcn)

### Ícones Principais
```tsx
import {
  Home,
  BookOpen,
  BarChart,
  Calendar,
  CreditCard,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
  Star,
  Check
} from 'lucide-react'
```

## 🎬 Animações

### Transições
```css
/* Transições suaves */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover scale */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Tailwind Classes
```tsx
{/* Hover effects */}
<div className="transition-all duration-300 hover:scale-105 hover:shadow-lg">

{/* Fade in */}
<div className="animate-in fade-in duration-500">

{/* Slide in */}
<div className="animate-in slide-in-from-left duration-500">
```

## 📱 Breakpoints

```css
/* Tailwind default */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Uso
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: 100% | Tablet: 50% | Desktop: 33% */}
</div>
```

## 🌓 Dark Mode

### Toggle Component
```tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
```

### Classes
```tsx
{/* Background que muda com tema */}
<div className="bg-white dark:bg-gray-900">

{/* Texto que muda com tema */}
<p className="text-gray-900 dark:text-white">

{/* Border que muda com tema */}
<div className="border border-gray-200 dark:border-gray-700">
```

## 🎨 Gradientes

### Emerald Gradient
```tsx
{/* Background gradient */}
<div className="bg-gradient-to-r from-emerald-500 to-emerald-600">

{/* Text gradient */}
<h1 className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">

{/* Sidebar gradient */}
<aside className="bg-gradient-to-b from-[#3cb371] to-[#2e8b57]">
```

### Outros Gradientes
```tsx
{/* Blue */}
<div className="bg-gradient-to-r from-blue-500 to-blue-600">

{/* Purple */}
<div className="bg-gradient-to-r from-purple-500 to-purple-600">

{/* Sunset */}
<div className="bg-gradient-to-r from-orange-400 to-pink-500">
```

## 📦 Espaçamento

### Padding & Margin
```
p-1: 0.25rem (4px)
p-2: 0.5rem (8px)
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
p-12: 3rem (48px)
```

### Grid & Flexbox
```tsx
{/* Flex center */}
<div className="flex items-center justify-center">

{/* Grid 3 colunas */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Flex wrap */}
<div className="flex flex-wrap gap-4">
```

## ✨ Efeitos Especiais

### Glass Effect
```tsx
<div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70">
  {/* Glassmorphism */}
</div>
```

### Shadow
```tsx
<div className="shadow-sm">    {/* Pequena */}
<div className="shadow-md">    {/* Média */}
<div className="shadow-lg">    {/* Grande */}
<div className="shadow-xl">    {/* Extra grande */}
<div className="shadow-2xl">   {/* Máxima */}
```

### Rounded
```tsx
<div className="rounded-sm">   {/* 2px */}
<div className="rounded-md">   {/* 6px */}
<div className="rounded-lg">   {/* 8px */}
<div className="rounded-xl">   {/* 12px */}
<div className="rounded-2xl">  {/* 16px */}
<div className="rounded-full"> {/* 50% */}
```

## 🎯 Componentes Prontos (shadcn/ui)

Para instalar componentes:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add form
```

Lista de componentes úteis:
- button
- card
- form
- input
- select
- dialog
- dropdown-menu
- tabs
- toast
- progress
- badge
- avatar
- calendar
- checkbox
- radio-group
- switch
- textarea
- tooltip

## 📐 Layout Padrão

### Page Container
```tsx
<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div className="container mx-auto px-4 py-8 max-w-7xl">
    {/* Content */}
  </div>
</main>
```

### Card Layout
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
    Título
  </h2>
  <p className="text-gray-600 dark:text-gray-300">
    Conteúdo
  </p>
</div>
```

---

**Última atualização:** 2025
**Designer:** Concurso PRO Team
