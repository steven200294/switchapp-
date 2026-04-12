FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY shared/package.json shared/
RUN cd shared && npm install
COPY backend/package.json backend/package-lock.json backend/
RUN cd backend && npm install

FROM base AS builder
COPY --from=deps /app/shared/node_modules shared/node_modules
COPY --from=deps /app/backend/node_modules backend/node_modules
COPY shared/ shared/
COPY backend/ backend/
RUN cd backend && npx prisma generate && npx tsc

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/shared shared
COPY --from=builder /app/backend/node_modules backend/node_modules
COPY --from=builder /app/backend/dist backend/dist
COPY --from=builder /app/backend/prisma backend/prisma
COPY --from=builder /app/backend/package.json backend/
COPY backend/entrypoint.sh backend/entrypoint.sh

EXPOSE ${API_PORT:-4001}
CMD ["sh", "backend/entrypoint.sh"]
