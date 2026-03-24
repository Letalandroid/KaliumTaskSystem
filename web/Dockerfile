# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
# Set API URL for production build
ENV VITE_API_URL=http://localhost:3001
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Add custom nginx config to handle SPA routing if needed
# For now, standard serving is fine as it's a simple CRUD
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
