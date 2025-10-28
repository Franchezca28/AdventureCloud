FROM node:20-alpine

WORKDIR /app
COPY reserva-service/package*.json ./
RUN npm install --omit=dev
COPY reserva-service/ .
EXPOSE 3000
CMD ["node", "server.js"]
