FROM maven:3-jdk-8
RUN apt-get update && apt-get install -y jq
COPY docker/build_images/jfreechart/symfinder_build.sh /symfinder_build.sh
CMD bash /symfinder_build.sh $PROJECT_NAME