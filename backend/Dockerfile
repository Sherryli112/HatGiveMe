FROM node:22-alpine As development

WORKDIR /usr/src/app

RUN apk add --no-cache openssl3 openssl-dev libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

#RUN npm run build

