FROM node:14.14-alpine

RUN mkdir -p /opt/karma

WORKDIR /opt/karma
RUN apk update && apk upgrade && apk add --no-cache chromium

COPY varicity/package.json /opt/karma/
COPY varicity/config /opt/karma/config
COPY varicity/public /opt/karma/public
COPY varicity/src /opt/karma/src
COPY varicity/tsconfig.json /opt/karma/

COPY docker/varicity_integration_tests/files /opt/karma/

COPY generated_visualizations/data /opt/karma/symfinder_files

RUN npm install && npm run-script build

CMD npm run test