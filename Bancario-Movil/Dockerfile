FROM node:22-alpine

RUN corepack enable

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

# Desactivar la verificación de navegación de Expo Router como en package.json
ENV EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1

EXPOSE 8081

# Ejecutar el servidor web de Expo
CMD ["pnpm", "exec", "expo", "start", "--web", "--port", "8081"]
