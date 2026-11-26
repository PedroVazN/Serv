FROM maven:3.9.12-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml ./
RUN mvn -B dependency:go-offline
COPY src/ src/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S serv && adduser -S -G serv serv
COPY --from=build --chown=serv:serv /build/target/serv-api.jar /app/serv-api.jar
ENV PORT=3000 SERVE_FRONTEND=false JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70.0 -XX:+ExitOnOutOfMemoryError"
USER serv
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "/app/serv-api.jar"]
