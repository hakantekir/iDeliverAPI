FROM node:18-alpine
LABEL authors="hakantekir"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .


EXPOSE 8000
CMD [ "node", "server.js" ]