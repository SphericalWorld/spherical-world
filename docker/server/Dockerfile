FROM node:10.8.0-alpine
WORKDIR /usr/src
EXPOSE 8080
VOLUME /usr/src/source
COPY ./server/package*.json ./
COPY ./app.ts ./app.ts
RUN npm install -g nodemon
RUN npm install && ln -s ./source/server server && ln -s ./source/common common && ln -s ./source/babel.config.js ./babel.config.js
CMD npm run start-server
