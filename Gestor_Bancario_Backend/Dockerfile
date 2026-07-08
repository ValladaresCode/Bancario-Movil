FROM node:22-alpine

# Habilitar corepack para poder usar pnpm
RUN corepack enable

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias con pnpm
RUN pnpm install

COPY . .

# El puerto 3006 está en el .env
EXPOSE 3006

CMD ["pnpm", "start"]
