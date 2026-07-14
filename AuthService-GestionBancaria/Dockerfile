FROM node:22-alpine

RUN corepack enable
RUN corepack prepare pnpm@10.29.3 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 3900

CMD ["pnpm", "start"]
