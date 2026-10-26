FROM node:20-alpine

WORKDIR /app

# Copia manifesto e instala dependências primeiro (cache de camadas)
COPY package*.json ./
RUN npm install --omit=dev

# Copia o restante do código
COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
