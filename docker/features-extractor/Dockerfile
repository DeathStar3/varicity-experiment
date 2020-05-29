FROM openjdk:15-jdk-alpine3.11
RUN apk add --no-cache python3
ADD docker/features-extractor/files/* /
RUN python3 tests.py
ENTRYPOINT sh extract.sh