FROM maven:3-jdk-8-alpine
RUN apk add jq
COPY docker/build_images/standard/symfinder_build.sh /symfinder_build.sh
CMD bash /symfinder_build.sh $PROJECT_NAME