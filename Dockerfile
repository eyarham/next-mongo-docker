FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ENV MONGODB_URI "mongodb://mongo:27017"

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev