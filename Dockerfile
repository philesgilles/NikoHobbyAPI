FROM node:12.2.0-alpine

ENV APP_NAME NIKO-HobbyAPI

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
