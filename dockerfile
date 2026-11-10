FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://garden_user:build-only@localhost:5432/garden_db?schema=public" npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
