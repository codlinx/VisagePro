FROM node:18-slim

WORKDIR /opt/app

COPY . .
RUN npm install
CMD npm start