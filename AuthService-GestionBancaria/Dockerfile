FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# El puerto 3900 está configurado en .env (copiado en runtime o pasado por docker-compose)
EXPOSE 3900

CMD ["npm", "start"]
