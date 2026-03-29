FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY shared/package.json shared/
RUN cd shared && npm install
COPY frontend/package.json frontend/package-lock.json frontend/
RUN cd frontend && npm install

FROM base AS builder
COPY --from=deps /app/shared/node_modules shared/node_modules
COPY --from=deps /app/frontend/node_modules frontend/node_modules
COPY shared/ shared/
COPY frontend/ frontend/
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=http://localhost:4001/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_STORAGE_URL=http://localhost:9000
ENV NEXT_PUBLIC_STORAGE_URL=${NEXT_PUBLIC_STORAGE_URL}
RUN cd frontend && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/frontend/public frontend/public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static .next/static
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static frontend/.next/static
USER nextjs

EXPOSE ${FRONTEND_PORT:-3001}
CMD ["node", "server.js"]
