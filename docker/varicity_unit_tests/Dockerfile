FROM node:14.14-alpine

RUN mkdir -p /opt/karma

WORKDIR /opt/karma
RUN apk update && apk upgrade && apk add --no-cache chromium

COPY varicity/. /opt/karma/

RUN npm install karma jasmine-core karma-jasmine karma-chrome-launcher karma-spec-reporter --save-dev
RUN npm install webpack ts-loader ts-node typescript webpack-cli yaml-loader --save-dev
RUN npm install fs @types/webpack-env --save-dev

RUN npm run-script build

CMD npm run test