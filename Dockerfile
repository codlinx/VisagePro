FROM node:18-slim

WORKDIR /opt/app

COPY ./package*.json .
RUN npm install

COPY . .
CMD npm start