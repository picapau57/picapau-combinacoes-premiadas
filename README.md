# 🐦 PICA-PAU COMBINAÇÕES PREMIADAS

Sistema web para geração de combinações numéricas organizadas (Milhares, Ternos de Dezenas e Ternos de Grupos), com cadastro, login, pagamento via PIX e painel administrativo.

> Este sistema **não prevê resultados, não garante acertos e não promete ganhos**. Ele apenas organiza combinações numéricas evitando repetições e concentrando distribuição equilibrada.

## 🚀 Instalação local

```bash
npm install
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais reais do Supabase:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA-CHAVE-ANON-PUBLICA
VITE_ADMIN_EMAIL=admin@picapau.com
```

Rode em modo desenvolvimento:

```bash
npm run dev
```

## 🏗️ Build de produção

```bash
npm run build
```

Isso gera a pasta `dist/`, pronta para publicação.

## ☁️ Publicar na Netlify

**Opção 1 — via site do Netlify (mais simples):**
1. Acesse [app.netlify.com](https://app.netlify.com) e faça login.
2. Clique em "Add new site" → "Import an existing project" (ou "Deploy manually" para arrastar a pasta `dist`).
3. Se conectar via Git: configure o comando de build como `npm run build` e o diretório de publicação como `dist`.
4. Em "Site settings" → "Environment variables", adicione `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_ADMIN_EMAIL`.
5. Clique em "Deploy site".

**Opção 2 — via terminal (Netlify CLI):**
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

O arquivo `netlify.toml` já está configurado com o comando de build e o redirect necessário para o React Router funcionar corretamente (evita erro 404 ao recarregar rotas internas).

## 🗄️ Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Crie a tabela `profiles` com as colunas: `id`, `full_name`, `whatsapp`, `username`, `email`, `payment_status`, `is_admin`, `released_at`, `created_at`.
3. Ative o Row Level Security (RLS) e crie políticas para que cada usuário veja apenas seus próprios dados, e para que apenas administradores vejam a tabela completa.
4. Copie a URL e a chave anônima do projeto para o `.env`.

## 📁 Estrutura do projeto

```
picapau-combinacoes-premiadas/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── netlify.toml
├── package.json
└── vite.config.ts
```
