FROM node:24-alpine AS frontend-build
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9.12-eclipse-temurin-21 AS backend-build
WORKDIR /build/backend
COPY backend/pom.xml ./
RUN mvn -B dependency:go-offline
COPY backend/src/ src/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S serv && adduser -S -G serv serv
COPY --from=backend-build --chown=serv:serv /build/backend/target/serv-api.jar /app/serv-api.jar
COPY --from=frontend-build --chown=serv:serv /build/frontend/dist/ /app/frontend/
ENV PORT=3000 SERVE_FRONTEND=true FRONTEND_PATH=/app/frontend JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70.0 -XX:+ExitOnOutOfMemoryError"
USER serv
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "/app/serv-api.jar"]
