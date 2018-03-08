FROM node:9-alpine

WORKDIR /usr/src/hashcheck
CMD [ "npm", "start" ]
EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install

COPY public ./public
COPY app.js check.html ./
