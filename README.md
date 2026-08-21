# Home Finances

## Description

A web application built with Nuxt 4 for managing home finances and expenses. Data is stored persistently in PostgreSQL using Drizzle ORM, with authentication powered by Supabase.

## Full Stack & SSR

This is a **full-stack application with server-side rendering (SSR) enabled**:

- **Full stack:** The frontend and backend live in the same Nuxt 4 codebase. The backend runs on Nitro, Nuxt's built-in server engine, exposing REST API routes under `server/api/` (e.g. `expenses`, `investments`), a server middleware for auth (`server/middleware/auth.ts`), and direct database access via Drizzle ORM.
- **SSR:** Server-side rendering is enabled (Nuxt's default — no `ssr: false` in `nuxt.config.ts`), so pages are rendered on the server before being hydrated on the client.

## Design

![add-expense-form](public/add-expense-form.jpg)
![expenses-stats](public/expenses-stats.jpg)

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`, `tailwind-scrollbar`
- **Fonts:** DM Sans Variable & DM Serif Display (Fontsource)
- **Icons:** [@nuxt/icon](https://github.com/nuxt/icon) with Material Symbols Light
- **Forms & validation:** [vee-validate](https://vee-validate.logaretm.com) (`@vee-validate/nuxt`)
- **Charts:** [ApexCharts](https://apexcharts.com) (`vue3-apexcharts`)
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team) (`drizzle-kit` for migrations)
- **Auth:** [Supabase](https://supabase.com) (`@nuxtjs/supabase`)
- **Testing:** Vitest (unit & Nuxt environments), Playwright (E2E)
- **Code quality:** ESLint 9 + Prettier
- **Package manager:** pnpm

## Setup

### Prerequisites

- Node.js (see `.nvmrc`)
- pnpm
- Docker (for the local PostgreSQL database)

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Installation

```bash
# install dependencies
$ pnpm install

# serve with hot reload at localhost:3000
$ pnpm dev
```

### Database migrations

```bash
# generate migrations from the schema
$ pnpm drizzle-kit generate

# apply migrations
$ pnpm drizzle-kit migrate
```

### Production build

```bash
$ pnpm build
$ pnpm preview
```

## Testing

```bash
# run all tests
$ pnpm test

# unit tests only
$ pnpm test:unit

# Nuxt component tests only
$ pnpm test:nuxt

# E2E tests (Playwright)
$ pnpm test:e2e
```

## Linting

```bash
# check for lint errors
$ pnpm lint

# fix lint errors automatically
$ pnpm lint:fix
```

## Contribution

To contribute to this project please check out the [contribution guidelines](https://github.com/YurisCodingClub/accessibility-mentor/blob/main/CONTRIBUTING.md).
