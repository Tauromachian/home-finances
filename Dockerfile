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

COPY package.json pnpm-lock.yaml .

RUN corepack enable
WORKDIR /app
RUN pnpm approve-builds esbuild && \
    pnpm install dotenv drizzle-kit drizzle-orm


COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/server/db/schema.ts ./server/db/schema.ts

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
