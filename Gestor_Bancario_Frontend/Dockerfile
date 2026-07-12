# Etapa 1: Construcción
FROM node:22-alpine as build

RUN corepack enable

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

ARG VITE_AUTH_API_URL
ARG VITE_ACCOUNT_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_ACCOUNT_URL=$VITE_ACCOUNT_URL

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
