# SPAECE Conecta — Repositório SPAECE

Repositório web para professores organizarem **jogos, atividades e simulados de Língua Portuguesa do 9º ano**, alinhados aos descritores do SPAECE. O sistema permite cadastrar materiais manualmente, filtrar o acervo e gerar novos conteúdos estruturados com IA para revisão e salvamento.

## Funcionalidades

- Acervo separado por **Jogos**, **Atividades** e **Simulados**.
- Busca por título, descrição ou descritor.
- Cadastro manual persistente de materiais.
- Visualização, duplicação e preparação para exportação.
- Gerador com IA por tipo de material, descritor, tema, nível e quantidade de itens.
- Resposta estruturada com título, descrição, orientações, tempo sugerido, questões, alternativas, gabarito e justificativa.
- Interface responsiva para computador e celular.
- Base inicial alinhada aos descritores da Matriz de Referência do SPAECE de Língua Portuguesa para o 9º ano.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Express + tRPC
- Drizzle ORM + MySQL/TiDB
- Manus OAuth
- Built-in LLM via `invokeLLM`
- Vitest

## Requisitos

- Node.js 20+ ou 22+
- pnpm 10+
- MySQL/TiDB para persistência
- Variáveis de ambiente do runtime Manus ou equivalentes para banco, OAuth e LLM

## Instalação local

```bash
pnpm install
pnpm db:push
pnpm dev
```

O servidor de desenvolvimento será iniciado pelo script fullstack em `server/_core/index.ts`.

## Scripts

```bash
pnpm dev       # inicia o ambiente de desenvolvimento
pnpm check     # verifica TypeScript
pnpm test      # executa os testes Vitest
pnpm build     # gera o frontend e empacota o servidor
pnpm db:push   # gera e aplica as migrações Drizzle
pnpm format    # formata os arquivos
```

## Variáveis de ambiente

No ambiente Manus, as variáveis de banco, autenticação e IA são injetadas pelo runtime. Em outra hospedagem, configure equivalentes às seguintes:

```env
DATABASE_URL=mysql://usuario:senha@host:3306/banco
JWT_SECRET=uma-chave-segura
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://seu-servidor-oauth
VITE_OAUTH_PORTAL_URL=https://seu-portal-oauth
BUILT_IN_FORGE_API_URL=https://seu-endpoint-de-llm
BUILT_IN_FORGE_API_KEY=sua-chave-de-llm
```

**Nunca** envie chaves reais para o GitHub. Use os Secrets do GitHub Actions ou as variáveis de ambiente da hospedagem.

## Banco de dados

O esquema está em `drizzle/schema.ts` e a migração inicial está em `drizzle/migrations/`. A tabela `materials` armazena tipo, título, descrição, descritor, nível, conteúdo e data de criação. A tabela `users` dá suporte ao fluxo de autenticação Manus.

Para evoluir o banco:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

Revise sempre o SQL gerado antes de aplicar em produção.

## Gerador com IA

A geração acontece exclusivamente no servidor, dentro do procedimento tRPC `materials.generate`, para não expor credenciais no navegador. O modelo recebe o tipo de material, descritor, tema, nível, quantidade de itens e pedido opcional. A resposta usa JSON Schema e só é apresentada ao professor para revisão; o salvamento no acervo é uma ação separada.

## Testes

Os testes atuais cobrem o logout e a geração estruturada do material com IA usando mock do modelo:

```bash
pnpm test
```

## Estrutura principal

```text
client/src/pages/Home.tsx   # interface do repositório e modais
client/src/index.css        # identidade visual e responsividade
drizzle/schema.ts           # tabelas do banco
server/db.ts                # consultas e inserção de materiais
server/routers.ts           # procedimentos tRPC e gerador com IA
server/materials.test.ts    # testes do gerador
```

## Conteúdo pedagógico

Os descritores exibidos na interface foram baseados na Matriz de Referência do SPAECE para Língua Portuguesa do 9º ano. Antes de usar o sistema como material oficial de avaliação, revise cada questão gerada e adapte linguagem, contexto e nível à realidade da turma.

## Licença

Defina aqui a licença do projeto antes de publicar o repositório, por exemplo MIT, Apache-2.0 ou uma licença institucional própria.
