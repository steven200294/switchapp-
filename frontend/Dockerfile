FROM node:20-alpine

WORKDIR /app

# Install shared deps
COPY shared/package.json shared/
RUN cd shared && npm install

# Install frontend deps
COPY frontend/package.json frontend/package-lock.json frontend/
RUN cd frontend && npm install

# Copy source
COPY shared/ shared/
COPY frontend/ frontend/

EXPOSE 3000

CMD ["npm", "--prefix", "frontend", "run", "dev"]
