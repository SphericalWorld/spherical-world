// @flow
const http = require('http');
const express = require('express');

const StaticLoader = function (port: number) {
  this.express = express();
  http.createServer(this.express).listen(port);

  // TODO: remove middleware

  this.express.use('/addons', express.static('./addons/'));

  this.express.get('/favicon.ico', (request, response) => {
    response.end();
  });

  this.express.use(express.static('./src'));

  console.log('Static loader has started.');
};

module.exports = StaticLoader;
