# Home Finances

A full-stack web application built with **Nuxt 4** for tracking personal and household finances. It runs with **server-side rendering (SSR)** on Nitro and persists data in **PostgreSQL** through **Drizzle ORM**, with authentication handled by **Supabase**.

## Features

- **Dashboard** — net worth snapshot, balance change, income, expenses, and cashflow summary with an Expenses vs Gains column chart. Follows the selected Personal/Group scope.
- **Expenses** — track one-off expenses (Manage) and recurring schedules (Frequent), with reports (totals, category breakdown donut, monthly line chart) and CSV/Excel import-export.
- **Income** — log one-off incomes (Manage) and recurring schedules (Frequent), with reports and CSV/Excel import-export.
- **Groups** — share expenses and incomes with a household or team. A scope switcher in the header toggles between Personal and each group; every member has equal manage rights. Members are invited by email on the Groups page.
- **Investments** — record holdings with current value, category, and description. Portfolio value is computed live and visualised with a donut (allocation) and line (value over time) chart.
- **Compound interest calculator** — estimate growth of an initial amount plus monthly contributions over time, with total invested and interest earned.
- **Authentication** — email/password login and signup powered by Supabase, with route protection on the API layer.

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript)
- **Server:** Nitro (Nuxt's built-in server engine) — REST API routes under `server/api/`
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`, `tailwind-scrollbar`
- **Fonts:** DM Sans Variable & DM Serif Display (Fontsource)
- **Icons:** [@nuxt/icon](https://github.com/nuxt/icon) with Material Symbols Light
- **Forms & validation:** [vee-validate](https://vee-validate.logaretm.com) (`@vee-validate/nuxt`)
- **Charts:** [ApexCharts](https://apexcharts.com) (`vue3-apexcharts`)
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team) (`drizzle-kit` for migrations)
- **Auth:** [Supabase](https://supabase.com) (`@nuxtjs/supabase`)
- **Testing:** Vitest (unit & Nuxt environments), Playwright (E2E)
- **Code quality:** ESLint 9 + Prettier
- **Container:** Docker (multi-stage `Dockerfile`)
- **CI/CD:** Woodpecker (`.woodpecker.yml`) — builds, deploys via SSH, and runs migrations
- **Package manager:** pnpm

## Full Stack & SSR

This is a **full-stack application with server-side rendering (SSR) enabled**:

- **Full stack:** The frontend and backend live in the same Nuxt 4 codebase. The backend runs on Nitro, exposing REST API routes under `server/api/` (e.g. `expenses`, `investments`), a server middleware for auth (`server/middleware/auth.ts`), and direct database access via Drizzle ORM.
- **SSR:** Server-side rendering is enabled (Nuxt's default — no `ssr: false` in `nuxt.config.ts`), so pages are rendered on the server before being hydrated on the client.

## Project Structure

```
app/                    # Nuxt 4 frontend (Vue components, pages, composables, types, utils)
  components/           # AppCard, AppDialog, charts, forms, dashboard, navbar, group pickers, ...
  pages/                # index, expenses, income, investments, compound-calculator, groups, login, confirm
  layouts/              # default, auth
  composables/          # useExpenses, useIncomes, useGroups (shared Personal/Group scope)
  services/             # API fetch wrappers (expenses, incomes, programmed*, groups)
  utils/                # period (dates, ranges, rounding), categories, frequencies, months, rules
  types/                # expense, income, investment, group, compound, item, category
server/                 # Nitro server (backend)
  api/
    expenses/           # index.get / index.post / [id].put / [id].delete
    incomes/            # index.get / index.post / [id].put / [id].delete
    programmed-expenses/# index.get / index.post / [id].put / [id].delete
    programmed-incomes/ # index.get / index.post / [id].put / [id].delete
    investments/        # index.get / index.post / [id].put / [id].delete
    groups/             # index.get / index.post / [id].get / [id].delete / [id]/members/...
  db/schema/            # Per-table Drizzle schema (expenses, incomes, programmed-*,
                        # investments, groups, users-groups, users, frequency)
  db/schema.ts          # Barrel re-exporting all tables (drizzle-kit entrypoint)
  utils/groupAccess.ts  # Group membership gates (assertGroupMember, assertRecordAccess, ...)
  middleware/auth.ts    # Protects /api/* with Supabase session
  orm/index.ts          # Drizzle client (pg)
public/                 # Static assets (screenshots, favicon)
compose.yaml            # Production Docker Compose definition (web service)
Dockerfile              # Multi-stage Node 24 build
drizzle.config.ts       # Drizzle Kit configuration
.env.example            # Template for required environment variables
```

## Database Schema

Defined per table in [`server/db/schema/`](server/db/schema/), re-exported from [`server/db/schema.ts`](server/db/schema.ts) (the drizzle-kit entrypoint):

| Table                 | Schema | Purpose                                                              |
| --------------------- | ------ | -------------------------------------------------------------------- |
| `users`               | `auth` | Extends Supabase's `auth.users` with `email`, `full_name`, `phone`   |
| `groups`              | public | Groups (`id`, `name`) for shared finances                            |
| `users_groups`        | public | Group memberships (`user_id`, `group_id`, unique per pair)           |
| `expenses`            | public | One-off expenses (amount, name, category, expense_date, description) |
| `incomes`             | public | One-off incomes (amount, name, income_date, description)             |
| `programmed_expenses` | public | Recurring expense schedules (frequency, charge_day, charge_month)    |
| `programmed_incomes`  | public | Recurring income schedules (frequency, charge_day, charge_month)     |
| `investments`         | public | Holdings (name, category, amount, current_value, description)        |

All data tables reference `auth.users.id` via `user_id` (authorship — always forced from the session, never trusted from the client). The expense/income tables (actuals and programmed) additionally carry a nullable `group_id`: `NULL` means a personal record, set means shared with that group. `investments` stays personal-only.

## API

All `/api/*` routes are protected by `server/middleware/auth.ts`, which throws `401 Unauthorized` when no Supabase session is present. The authenticated user is exposed on `event.context.user` (with `id` mapped from Supabase's `sub` claim).

Record routes (`expenses`, `incomes`, `programmed-expenses`, `programmed-incomes`) are group-aware via `server/utils/groupAccess.ts`:

- `GET` returns the user's personal records plus records shared with their groups.
- `POST`/`PUT` accept an optional `groupId` (omitted = personal); a non-member `groupId` fails with `403`.
- `PUT`/`DELETE` on a personal record require ownership; on a shared record require group membership (`403` otherwise, `404` when missing).

| Method   | Path                              | Description                                                                   |
| -------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `GET`    | `/api/expenses`                   | List personal + group-shared expenses                                         |
| `POST`   | `/api/expenses`                   | Create an expense (optional `groupId`)                                        |
| `POST`   | `/api/expenses/import`            | Batch-import expense rows (validated per row; returns `{ inserted, errors }`) |
| `PUT`    | `/api/expenses/:id`               | Update an expense                                                             |
| `DELETE` | `/api/expenses/:id`               | Delete an expense                                                             |
| `GET`    | `/api/incomes`                    | List personal + group-shared incomes                                          |
| `POST`   | `/api/incomes`                    | Create an income (optional `groupId`)                                         |
| `POST`   | `/api/incomes/import`             | Batch-import income rows (validated per row; returns `{ inserted, errors }`)  |
| `PUT`    | `/api/incomes/:id`                | Update an income                                                              |
| `DELETE` | `/api/incomes/:id`                | Delete an income                                                              |
| `GET`    | `/api/programmed-expenses`        | List personal + shared programmed expenses                                    |
| `POST`   | `/api/programmed-expenses`        | Create a programmed expense                                                   |
| `PUT`    | `/api/programmed-expenses/:id`    | Update a programmed expense                                                   |
| `DELETE` | `/api/programmed-expenses/:id`    | Delete a programmed expense                                                   |
| `GET`    | `/api/programmed-incomes`         | List personal + shared programmed incomes                                     |
| `POST`   | `/api/programmed-incomes`         | Create a programmed income                                                    |
| `PUT`    | `/api/programmed-incomes/:id`     | Update a programmed income                                                    |
| `DELETE` | `/api/programmed-incomes/:id`     | Delete a programmed income                                                    |
| `GET`    | `/api/investments`                | List investments for the user                                                 |
| `POST`   | `/api/investments`                | Create an investment                                                          |
| `PUT`    | `/api/investments/:id`            | Update an investment                                                          |
| `DELETE` | `/api/investments/:id`            | Delete an investment                                                          |
| `GET`    | `/api/groups`                     | List my groups                                                                |
| `POST`   | `/api/groups`                     | Create a group (creator auto-joins)                                           |
| `GET`    | `/api/groups/:id`                 | Get a group (members only)                                                    |
| `DELETE` | `/api/groups/:id`                 | Delete a group (blocked while shared records exist)                           |
| `GET`    | `/api/groups/:id/members`         | List group members (with emails)                                              |
| `POST`   | `/api/groups/:id/members`         | Add a member by email (`404` unknown, `409` duplicate)                        |
| `DELETE` | `/api/groups/:id/members/:userId` | Remove a member                                                               |

## Design

![Expenses stats](public/dashboard.png)

## Setup

### Prerequisites

- Node.js (see [`.nvmrc`](.nvmrc))
- pnpm
- A PostgreSQL instance (local install, Docker container, or managed service)
- A Supabase project (URL + anon key)

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable                   | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `NUXT_DB_HOST`             | PostgreSQL host (e.g. `localhost`)                      |
| `NUXT_DB_PORT`             | PostgreSQL port (default `5432`)                        |
| `NUXT_DB_NAME`             | PostgreSQL database name                                |
| `NUXT_DB_USER`             | PostgreSQL user                                         |
| `NUXT_DB_PASSWORD`         | PostgreSQL password                                     |
| `NUXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL                               |
| `NUXT_PUBLIC_SUPABASE_KEY` | Your Supabase anon key                                  |
| `APP_COMPOSE_PORT`         | Host port mapped to the container's `3000` (production) |
| `NODE_ENV`                 | `development` or `production`                           |

### Installation

```bash
# install dependencies
pnpm install

# start the dev server with hot reload at http://localhost:3000
pnpm dev
```

### Database migrations

```bash
# generate migrations from the schema
pnpm drizzle-kit generate

# apply migrations
pnpm drizzle-kit migrate
```

## Testing

```bash
# run all tests
pnpm test

# unit tests only
pnpm test:unit

# Nuxt component tests only
pnpm test:nuxt

# E2E tests (Playwright)
pnpm test:e2e
```

## Linting

```bash
# check for lint errors
pnpm lint

# fix lint errors automatically
pnpm lint:fix
```

## Production build

### Local

```bash
pnpm build
pnpm preview
```

### Docker

The provided `compose.yaml` runs the Nuxt app in a container (it expects an external PostgreSQL reachable at the host configured in `.env`). The multi-stage `Dockerfile` builds the application and runs it with `node .output/server/index.mjs` on port `3000`.

```bash
docker compose build --no-cache
docker compose up -d

# apply migrations against the database referenced in .env
docker exec home-finances-web-1 pnpm drizzle-kit push
```

### Deployment

[`.woodpecker.yml`](.woodpecker.yml) defines a CI/CD pipeline that, on pushes to `main`:

1. Clones or pulls the repository on the target host over SSH.
2. Writes the production `.env` from pipeline secrets.
3. Rebuilds and restarts the Docker stack.
4. Runs `drizzle-kit push` inside the web container to sync the schema.

## License

[MIT](package.json)
