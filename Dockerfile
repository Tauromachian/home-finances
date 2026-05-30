FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm postinstall
RUN pnpm run build

# === Production stage ===
FROM node:24-alpine

RUN corepack enable
WORKDIR /app
RUN pnpm install dotenv

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
