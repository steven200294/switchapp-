FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY admin/package.json admin/package-lock.json* admin/
RUN cd admin && npm install

FROM base AS builder
COPY --from=deps /app/admin/node_modules admin/node_modules
COPY admin/ admin/
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=http://localhost:4001/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_STORAGE_URL=http://localhost:9000
ENV NEXT_PUBLIC_STORAGE_URL=${NEXT_PUBLIC_STORAGE_URL}
ARG NEXT_PUBLIC_GRAFANA_URL=http://localhost:3100
ENV NEXT_PUBLIC_GRAFANA_URL=${NEXT_PUBLIC_GRAFANA_URL}
ARG NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}
RUN cd admin && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/admin/public admin/public
COPY --from=builder /app/admin/public public
COPY --from=builder --chown=nextjs:nodejs /app/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/admin/.next/static .next/static
COPY --from=builder --chown=nextjs:nodejs /app/admin/.next/static admin/.next/static
USER nextjs

EXPOSE ${ADMIN_PORT:-3002}
CMD ["node", "server.js"]
