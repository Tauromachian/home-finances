# AGENTS.md

Nuxt 4 (Vue 3 + TS) full-stack app. Frontend in `app/`, Nitro API in `server/api/`, Postgres via Drizzle ORM, auth via Supabase. SSR enabled. Package manager: **pnpm** (v11.8.0), Node v24.16.0 (`.nvmrc`).

## Commands

- `pnpm install` / `pnpm dev` (localhost:3000) / `pnpm build` / `pnpm preview`
- `pnpm lint` / `pnpm lint:fix` (ESLint 9 + Prettier; fix before committing)
- `pnpm test:unit --run` / `pnpm test:nuxt --run` (Vitest, `--run` to avoid watch mode)
- `pnpm test:e2e` (Playwright, hits production URL — don't run casually)
- `pnpm exec vue-tsc --noEmit -p tsconfig.json` (typecheck)
- `pnpm db:push` (sync Drizzle schema to DB; generate with `pnpm drizzle-kit generate`)

Copy `.env.example` to `.env` for local DB/Supabase vars.

## Structure

- `app/pages/` — routes; tab state lives in `?tab=` query param (see `app/composables/useTab.ts`)
- `app/components/<domain>/` — per-domain components (`expense/`, `income/`, `investment/`); shared UI as `App*`/`Base*`
- `app/composables/`, `app/services/` (API fetch wrappers), `app/utils/`, `app/types/`
- `server/api/` — REST routes; `server/db/schema/` — one file per table, re-exported from `server/db/schema.ts`; `server/utils/groupAccess.ts` — authZ helpers
- `test/unit/`, `test/nuxt/`, `test/e2e/`

## Conventions

- Nuxt auto-imports: `ref/computed/useRoute`, composables, and `~/utils/*` helpers need no import. Components resolve as `<DomainName>` from `app/components/<domain>/<Name>.vue` (e.g. `expense/ManageTab.vue` → `<ExpenseManageTab>`).
- Data tables carry `user_id` (forced from session, never from client) + nullable `group_id` (`NULL` = personal). Enforce via `server/utils/groupAccess.ts`, not ad-hoc checks.
- Styles: Tailwind v4. Keep variant classes as static literals where Tailwind safelisting matters (see `BaseButton.vue` note).
- Icons: `@nuxt/icon`. Keep `icon.serverBundle.collections` in `nuxt.config.ts` covering every collection used, or SSR hydration mismatches. Wrap only client-only icons in `<ClientOnly>`.
- `cloneVNode` merges `onClick` automatically — don't re-invoke the child's handler manually.
- Keep `data-testid`s stable (`expenses-items`, `reports-total`, …) — e2e depends on them.
