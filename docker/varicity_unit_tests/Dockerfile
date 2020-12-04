FROM node:14.14-alpine

RUN mkdir -p /opt/karma

WORKDIR /opt/karma
RUN apk update && apk upgrade && apk add --no-cache chromium

COPY varicity/. /opt/karma/

RUN npm install && npm run-script build

CMD npm run test