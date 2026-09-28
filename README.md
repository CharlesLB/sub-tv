# sub.tv

Ferramenta interna de gestão e transmissão do futebol de base mineiro (Sub-13 e Sub-14): campeonatos por temporada, elencos por clube e categoria, histórico estatístico desde 2017, criação de partida e tela de narração ao vivo. Os dados vêm da Federação Mineira de Futebol (tabelas, classificações, artilharia e súmulas em PDF).

Stack: Next.js 16.3 (App Router, Cache Components, Turbopack), React 19, TypeScript estrito, Tailwind CSS v4, Drizzle ORM + Postgres (Neon em produção, PGlite no desenvolvimento), Zod, Vitest e Playwright.

## Rodando localmente

Pré-requisitos: Node 24+ e pnpm 10.

```bash
pnpm install
cp .env.example .env.local            # ajuste SESSION_SECRET (openssl rand -hex 32)
pnpm db:local                          # Postgres local (PGlite) em localhost:5432, dados em .data/pglite
pnpm db:migrate                        # em outro terminal
pnpm fmf:import                        # carga histórica completa da FMF (≈1 h na primeira vez)
pnpm users:create "Rafaela Torres" "senha"  # cria (ou redefine a senha de) um usuário
pnpm dev                               # http://localhost:3000
```

A carga grava tudo o que baixa em `.data/raw/fmf/` (HTML das competições e PDFs das súmulas) antes de processar. Rodadas seguintes reaproveitam os arquivos: `pnpm fmf:import --only-load` reprocessa sem acessar a FMF; `--edition=<id>` limita a uma edição; `--refresh` baixa de novo.

## Deploy na Vercel

1. Crie o banco: na Vercel, **Storage → Marketplace → Neon (Postgres)** e conecte ao projeto. Isso cria `DATABASE_URL` nos ambientes.
2. Em **Settings → Environment Variables**, adicione `SESSION_SECRET` e `CRON_SECRET` (64 caracteres hex cada; `openssl rand -hex 32`). A Vercel envia o `CRON_SECRET` automaticamente na chamada diária de `/api/cron/fmf-sync` (configurada em `vercel.json`, 06:00 de Brasília), que busca jogos e súmulas novos das edições em andamento.
3. Aplique o schema e carregue os dados no Neon a partir da sua máquina, usando a URL de conexão do Neon:

   ```bash
   DATABASE_URL="postgres://…neon.tech/…?sslmode=require" pnpm db:migrate
   DATABASE_URL="postgres://…neon.tech/…?sslmode=require" pnpm fmf:import --only-load
   DATABASE_URL="postgres://…neon.tech/…?sslmode=require" pnpm users:create "Rafaela Torres" "<senha>"
   ```

   (`--only-load` usa os arquivos já baixados em `.data/raw/fmf/`; sem eles, rode sem a flag.)

4. Faça o deploy (`vercel --prod` ou push no repositório conectado). O build não precisa de acesso à FMF.

## Scripts

| Comando                                                                   | O que faz                                                                   |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                                                                | Servidor de desenvolvimento                                                 |
| `pnpm build` / `pnpm start`                                               | Build e servidor de produção                                                |
| `pnpm check`                                                              | `typecheck` + `lint` + `test`                                               |
| `pnpm test`                                                               | Testes unitários (Vitest)                                                   |
| `pnpm e2e`                                                                | Testes de ponta a ponta (Playwright)                                        |
| `pnpm db:generate`                                                        | Gera migração a partir de `src/lib/db/schema.ts`                            |
| `pnpm db:migrate`                                                         | Aplica as migrações em `DATABASE_URL`                                       |
| `pnpm fmf:import`                                                         | Carga/recarga dos dados da FMF (idempotente)                                |
| `pnpm fmf:sync`                                                           | Sincronização incremental das edições em andamento (a mesma do cron diário) |
| `pnpm users:create "<usuário>" "<senha>"`                                 | Cria um usuário ou redefine a senha (nome sem diferenciar maiúsculas)       |
| `pnpm screenshot <rota> <arquivo.png> <claro\|escuro> <largura> <altura>` | Captura de tela autenticada (`SCREENSHOT_USERNAME`/`SCREENSHOT_PASSWORD`)   |

## Organização

- `src/app/` — rotas finas (`/campeonatos`, `/campeonatos/[id]`, `/campeonatos/[id]/nova-partida` com modal interceptado, `/ao-vivo/[partidaId]`, `/elencos`, `/historico`, `/historico/times/[timeId]`, `/historico/atletas/[atletaId]`, `/entrar`).
- `src/modules/` — domínio: `championships`, `teams`, `players`, `matches`, `live`, `history`, `platform` (shell), `auth`.
- `src/lib/` — infraestrutura: banco, sessão, tags de cache, rotas tipadas, utilitários.
- `scripts/fmf-import/` — importador da FMF.
- `spec/` — handoff de design e especificações.

Regras de código: `.claude/rules/` (ver `AGENTS.md`).

## Dados e privacidade

Os atletas são menores de idade. A consulta (campeonatos, elencos, histórico) é aberta; criar partida, narrar ao vivo, editar elencos, criar campeonato, ver o registro de alterações e gerenciar usuários exigem usuário e senha (senhas guardadas com bcrypt; usuários em `/usuarios`). Toda alteração — ficha de jogador, curiosidades, criação de partida, eventos e relógio ao vivo, entradas e saídas — é gravada na tabela `audit_log` com o usuário que a fez; o importador não guarda data de nascimento nem publica o ID CBF. Campos editoriais (apelido de narração, posição, pé, curiosidades, sigla e cor do clube) são da equipe e nunca são sobrescritos pela carga.
