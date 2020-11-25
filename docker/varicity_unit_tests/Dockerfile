FROM node:14.14-alpine
RUN mkdir -p /opt/karma
WORKDIR /opt/karma
RUN apk update && apk upgrade && apk add --no-cache chromium
COPY docker/varicity_unit_tests/files/ /opt/karma/
RUN npm install karma jasmine-core karma-jasmine karma-chrome-launcher karma-spec-reporter --save-dev
CMD npm run test