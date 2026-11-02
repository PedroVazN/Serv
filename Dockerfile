FROM node:24-alpine AS frontend-build
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:24-alpine AS production
ENV NODE_ENV=production
ENV SERVE_FRONTEND=true
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node backend/src/ ./src/
COPY --from=frontend-build --chown=node:node /build/frontend/dist /app/frontend/dist
USER node
EXPOSE 3000
CMD ["node", "src/app.js"]
