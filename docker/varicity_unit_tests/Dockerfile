FROM node:14.14-alpine
WORKDIR /usr/src/app
COPY varicity/package*.json ./
RUN npm install webpack@4.44.0 --save-dev
COPY varicity/ .
CMD npm install && npm run test