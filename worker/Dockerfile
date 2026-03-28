FROM node:20-alpine

WORKDIR /app

# Install shared deps
COPY shared/package.json shared/
RUN cd shared && npm install

# Install worker deps
COPY worker/package.json worker/
RUN cd worker && npm install

# Copy source
COPY shared/ shared/
COPY worker/ worker/

# Generate Prisma client (shares schema with backend)
COPY backend/prisma/ backend/prisma/
COPY backend/package.json backend/
RUN cd backend && npm install --omit=dev && npx prisma generate

EXPOSE ${WORKER_PORT}

CMD ["npm", "--prefix", "worker", "run", "dev"]
