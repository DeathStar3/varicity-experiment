FROM node:14.14-alpine
WORKDIR /usr/src/app
COPY varicity/ .
RUN npm install webpack@4.44.0 --save-dev
CMD npm install && npm run test