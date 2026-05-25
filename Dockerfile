FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", "run", ".output/server/index.mjs"]
