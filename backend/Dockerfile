FROM node:20-alpine

WORKDIR /app

# Install shared deps
COPY shared/package.json shared/
RUN cd shared && npm install

# Install backend deps
COPY backend/package.json backend/
RUN cd backend && npm install

# Copy source
COPY shared/ shared/
COPY backend/ backend/

# Generate Prisma client
RUN cd backend && npx prisma generate

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "run", "dev"]
