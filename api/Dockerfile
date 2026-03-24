# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app
RUN mkdir -p /app/data

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 3001

# Use a shell to run multiple commands: prisma db push then start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main"]
