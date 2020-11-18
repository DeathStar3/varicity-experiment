FROM node:14.14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 8080

COPY . .