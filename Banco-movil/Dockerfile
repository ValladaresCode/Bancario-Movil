FROM node:22-alpine AS build

RUN corepack enable
RUN corepack prepare pnpm@10.29.3 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG EXPO_PUBLIC_AUTH_URL
ARG EXPO_PUBLIC_BANK_URL
ARG EXPO_PUBLIC_BANK_HEALTH_URL
ENV EXPO_PUBLIC_AUTH_URL=${EXPO_PUBLIC_AUTH_URL}
ENV EXPO_PUBLIC_BANK_URL=${EXPO_PUBLIC_BANK_URL}
ENV EXPO_PUBLIC_BANK_HEALTH_URL=${EXPO_PUBLIC_BANK_HEALTH_URL}

RUN npx expo export --platform web --output-dir dist

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
