# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .


RUN cp .env.example .env

RUN npm run build

EXPOSE ${API_PORT}
CMD ["npm", "run", "start:prod"]
