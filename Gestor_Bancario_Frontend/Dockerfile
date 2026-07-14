# Etapa 1: Construcción
FROM node:22-alpine as build

RUN corepack enable
RUN corepack prepare pnpm@10.29.3 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_AUTH_API_URL
ARG VITE_BANK_API_URL
ARG VITE_BANK_HEALTH_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_BANK_API_URL=$VITE_BANK_API_URL
ENV VITE_BANK_HEALTH_URL=$VITE_BANK_HEALTH_URL

# Construimos la aplicación Vite
RUN pnpm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine

# Copiamos la configuración de nginx para soportar SPA routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos generados en la etapa de construcción
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
