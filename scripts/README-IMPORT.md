# Script de Importação de Materiais

Este script permite importar PDFs e imagens em massa para o banco de dados do Concurso PRO, mantendo a estrutura de pastas original.

## 📋 Pré-requisitos

1. Node.js instalado
2. Variáveis de ambiente configuradas no `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 📁 Estrutura de Pastas Esperada

```
C:\Users\Admin\Desktop\PDF\CONTEÚDO\
├── CARREIRAS POLICIAIS\
│   ├── Disciplina 1\
│   │   ├── aula-01.pdf
│   │   └── aula-02.pdf
│   └── Disciplina 2\
│       └── aula-03.pdf
├── CARREIRAS MILITARES\
│   └── ...
└── ENEM E VESTIBULARES\
    └── ...
```

**Importante:**
- Os nomes das pastas principais devem corresponder aos módulos (ver mapeamento no script)
- A estrutura interna é mantida automaticamente
- Imagens são organizadas em pasta "Imagens" dentro de cada módulo

## 🚀 Como Usar

### 1. Organize seus arquivos

Coloque os PDFs na pasta: `C:\Users\Admin\Desktop\PDF\CONTEÚDO`

Cada subpasta deve ter o nome do módulo correspondente:
- CARREIRAS POLICIAIS
- CARREIRAS MILITARES
- CARREIRAS FISCAIS
- CARREIRAS JURÍDICAS
- CARREIRAS BANCÁRIAS
- CARREIRAS EM EDUCAÇÃO
- CARREIRAS EM SAÚDE
- CARREIRAS ADMINISTRATIVAS
- CARREIRAS TI
- CARREIRAS EM ENGENHARIA
- CONTROLE E FISCALIZAÇÃO
- CORREIOS E LOGÍSTICA
- ÁREA LEGISLATIVA
- ENEM E VESTIBULARES

### 2. Execute o script

No terminal, dentro da pasta do projeto:

```bash
npm run import-materials
```

Ou execute diretamente:

```bash
node scripts/import-materials.mjs
```

## 📊 O que o script faz

1. ✅ Lê recursivamente todos os PDFs e imagens da pasta
2. ✅ Mantém a estrutura de pastas original
3. ✅ Sanitiza nomes de arquivos (remove acentos, espaços especiais)
4. ✅ Faz upload para o Supabase Storage
5. ✅ Insere registros na tabela `materials`
6. ✅ Separa imagens em pasta dedicada
7. ✅ Calcula tamanho dos arquivos
8. ✅ Mostra progresso em tempo real
9. ✅ Gera relatório de sucesso/erros ao final

## 📝 Exemplo de saída

```
🚀 Iniciando importação de materiais...

📦 Buscando módulos do banco de dados...
✅ 14 módulos encontrados

📁 14 pastas de módulos encontradas

────────────────────────────────────────────────────────────────────────────────

📚 Processando módulo: CARREIRAS POLICIAIS
   Slug: policiais | ID: abc-123
   📄 25 PDFs encontrados
   🖼️  3 imagens encontradas
   [1/25] ⬆️  Uploading: Direito Constitucional/aula-01.pdf
   [1/25] ✅ Sucesso: aula-01.pdf
   [2/25] ⬆️  Uploading: Direito Constitucional/aula-02.pdf
   [2/25] ✅ Sucesso: aula-02.pdf
   ...

════════════════════════════════════════════════════════════════════════════════
📊 RESUMO DA IMPORTAÇÃO
════════════════════════════════════════════════════════════════════════════════
📁 Total de arquivos encontrados: 350
✅ Arquivos enviados com sucesso: 345
❌ Arquivos com erro: 2
⏭️  Arquivos pulados (já existentes): 3
════════════════════════════════════════════════════════════════════════════════

✨ Importação concluída!
```

## 🔧 Personalizações

### Mudar o caminho da pasta

Edite a linha no script:

```javascript
const BASE_PATH = 'C:\\Users\\Admin\\Desktop\\PDF\\CONTEÚDO'
```

### Adicionar novo módulo ao mapeamento

Edite o objeto `MODULE_MAPPING`:

```javascript
const MODULE_MAPPING = {
  'NOME DA PASTA': 'slug-do-modulo',
  // ...
}
```

## ⚠️ Observações

- Arquivos duplicados são automaticamente pulados
- O script usa a Service Role Key para ter permissões de admin
- Recomenda-se fazer backup do banco antes de importações grandes
- Imagens são organizadas automaticamente em pasta "Imagens"
- A estrutura de pastas é preservada nos títulos dos materiais

## 🐛 Solução de Problemas

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env.local` existe
- Confirme que as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão definidas

### Erro: "Diretório não encontrado"
- Verifique se a pasta existe: `C:\Users\Admin\Desktop\PDF\CONTEÚDO`
- Confirme os caminhos no Windows (use `\\` ou `/`)

### Erro: "Módulo não encontrado no banco"
- Execute primeiro as migrations do banco de dados
- Verifique se os módulos foram criados na tabela `modules`
- Confirme que os slugs estão corretos

### Muitos arquivos com erro
- Verifique as permissões do bucket `materials` no Supabase Storage
- Confirme que as RLS policies permitem inserção
- Aumente o timeout se necessário
