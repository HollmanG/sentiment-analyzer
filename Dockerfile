FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ./node_modules/.bin/nest build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
