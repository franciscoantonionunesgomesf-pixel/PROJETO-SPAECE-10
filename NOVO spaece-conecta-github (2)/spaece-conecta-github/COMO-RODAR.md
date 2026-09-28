# SPAECE Conecta — Como rodar o sistema

Guia prático para colocar o sistema no ar, tanto no ambiente de desenvolvimento
quanto como build de produção.

---

## 1. Requisitos

- **Node.js 20+** (testado com Node 20.20.2)
- **pnpm 10+** (o projeto usa `pnpm@10.4.1`)
- (Opcional) **MySQL/MariaDB** — só é necessário para persistir materiais e para o
  gerador com IA. A interface principal (acervo, busca, filtro, modal e PDF) funciona
  **sem banco de dados**, pois usa dados locais em `client/src/data/atividadesDrive.ts`.

Para ativar o pnpm sem instalá-lo globalmente:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

---

## 2. Instalação

```bash
pnpm install
```

> Se aparecer o aviso "Ignored build scripts: @tailwindcss/oxide, core-js, esbuild",
> aprove os builds (já configurados em `package.json` → `pnpm.onlyBuiltDependencies`):

```bash
pnpm rebuild esbuild @tailwindcss/oxide core-js
```

---

## 3. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto. Para rodar apenas a interface, os valores
podem ficar vazios:

```env
NODE_ENV=development
PORT=3000

# Banco de dados (opcional para a interface principal)
DATABASE_URL=

# Sessão / autenticação
JWT_SECRET=spaece-conecta-dev-secret-change-me
OWNER_OPEN_ID=

# OAuth (Manus) — opcional em ambiente local
VITE_APP_ID=spaece-conecta-local
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=

# LLM (gerador com IA) — opcional em ambiente local
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
```

Para usar o banco (MySQL) e o gerador com IA, preencha `DATABASE_URL`,
`OAUTH_SERVER_URL`, `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` com os
valores reais do seu ambiente.

---

## 4. Rodar em desenvolvimento

```bash
pnpm dev
```

O servidor sobe em **http://localhost:3000/** (o script usa
`NODE_ENV=development tsx watch server/_core/index.ts`, que já integra o Vite no
modo fullstack).

Acesse no navegador: `http://localhost:3000/`

---

## 5. Banco de dados (opcional)

```bash
pnpm db:push   # gera e aplica as migrações Drizzle
```

O esquema está em `drizzle/schema.ts` (tabelas `users` e `materials`).

---

## 6. Verificações e testes

```bash
pnpm check   # checagem de tipos TypeScript
pnpm test    # testes Vitest
```

---

## 7. Build de produção

```bash
pnpm build
```

Isso gera o frontend em `dist/public` e empacota o servidor em `dist/`.
Para servir em produção:

```bash
NODE_ENV=production node dist/index.js
```

### Build apenas do frontend (site estático)

A interface é 100% client-side. Para gerar um site estático:

```bash
pnpm exec vite build --base ./
```

O resultado fica em `dist/public` (`index.html` + `assets/`). Use `--base ./` para
que os assets funcionem mesmo quando publicados em um subdiretório.

---

## 8. Funcionalidades verificadas

- Acervo de **14 atividades / 14 descritores / 280 questões**.
- **Busca ao vivo** por título/descritor (ex.: "inferir" → filtra para D3).
- **Filtro por descritor** (chips e barra lateral).
- **Modal "Ver"** com as questões e o **gabarito**.
- **Download em PDF** profissional (gerado no navegador com jsPDF, ~107 KB por atividade).

---

## 9. Estrutura principal

```text
client/src/pages/Home.tsx    # interface do acervo
client/src/index.css         # identidade visual e responsividade
client/src/data/atividadesDrive.ts  # base de atividades (dados locais)
client/src/lib/activityPdf.ts       # geração de PDF
server/_core/index.ts        # servidor Express + Vite (fullstack)
server/routers.ts            # procedimentos tRPC (materiais + gerador com IA)
drizzle/schema.ts            # tabelas do banco
```
