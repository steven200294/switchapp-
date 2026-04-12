FROM node:20-alpine

WORKDIR /app

# Install shared deps
COPY shared/package.json shared/
RUN cd shared && npm install

# Install worker deps
COPY worker/package.json worker/
RUN cd worker && npm install

# Generate Prisma client using backend's pinned prisma version
COPY backend/prisma/ backend/prisma/
COPY backend/package.json backend/
RUN cd backend && npm install --omit=dev && npx prisma generate

# Copy generated client into worker's node_modules (replace stubs)
RUN rm -rf worker/node_modules/.prisma && cp -r backend/node_modules/.prisma worker/node_modules/.prisma

# Copy source
COPY shared/ shared/
COPY worker/ worker/

EXPOSE ${WORKER_PORT}

CMD ["npm", "--prefix", "worker", "run", "dev"]
