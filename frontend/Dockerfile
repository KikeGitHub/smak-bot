# Etapa 1: Build de producción de Angular 20 (RAM limitada para VPS compartido)
FROM node:22-alpine AS build
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=768"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servidor Nginx + Reverse Proxy (< 15 MB RAM)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
