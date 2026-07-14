FROM node:22-alpine

# Habilitar corepack para poder usar pnpm
RUN corepack enable
RUN corepack prepare pnpm@10.29.3 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias de producción con lockfile
RUN pnpm install --frozen-lockfile --prod

COPY . .

# El puerto 3006 está en el .env
EXPOSE 3006

CMD ["pnpm", "start"]
