FROM node:14.17-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENTRYPOINT [ "npm", "run", "job" ]
