FROM node:8-alpine
MAINTAINER Dênis Vilela <denisxvilela@gmail.com>

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
