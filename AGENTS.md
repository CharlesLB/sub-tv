<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# sub.tv — project rules

- Rules live in `.claude/rules/nextjs/` (architecture, Next.js 16 APIs) and `.claude/rules/general/` (code style). When they conflict, the Next.js rules win for architecture; the style rules still apply: no code comments, no `any`/`as` casts, no `let`/`var`, no imperative loops (Remeda), full descriptive names, named string constants.
- Product and design source of truth: `spec/README.md`, `spec/design_files/*.dc.html`, `spec/screenshots/`. The design has light (default) and dark themes (`data-tema` on `<html>`); tokens are in `src/app/globals.css`.
- Data: Postgres via Drizzle (`src/lib/db`); schema from `spec/tech_spec/db`. FMF history (Sub-13/Sub-14, 2017→today) is loaded by `pnpm fmf:import` (`scripts/fmf-import/`), idempotent; columns marked editorial are never overwritten by the importer.
- Local database: `pnpm db:local` (PGlite server on :5432) → `pnpm db:migrate` → `pnpm fmf:import`. Production: Neon Postgres on Vercel (`DATABASE_URL`), same commands pointed at it.
- Reading is public; `proxy.ts` only protects editing routes (`/campeonatos/*/nova-partida`, `/ao-vivo/*`, `/registro`, `/usuarios`, `/api/*` except `/api/cron`, which checks `CRON_SECRET`), and those pages also call `requireUser()`. Screens hide editing controls for signed-out visitors; every Server Action calls `requireUser()` from `@/modules/auth` first and writes an `audit_log` row via `recordAudit()` from `@/modules/audit` after a successful change. Users are created with `pnpm users:create`; usernames are case-insensitive.
