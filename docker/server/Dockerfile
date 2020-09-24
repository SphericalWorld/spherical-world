FROM node:14.4.0-alpine3.10
WORKDIR /usr/src
EXPOSE 8080
VOLUME /usr/src/source
COPY ./server/package*.json ./
COPY ./app.ts ./app.ts
RUN npm install -g nodemon
RUN npm install && ln -s ./source/server server && ln -s ./source/common common && ln -s ./source/babel.config.js ./babel.config.js && ln -s ./source/server/nodemon.json ./nodemon.json
CMD npm run start-server
