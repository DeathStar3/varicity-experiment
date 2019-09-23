FROM maven:3-jdk-8-alpine
RUN apk add git
COPY docker/build_images/tinkerpop/symfinder_build.sh /symfinder_build.sh
CMD bash /symfinder_build.sh $PROJECT_NAME