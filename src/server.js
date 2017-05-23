const express     = require('express');
const routes      = require('./routes.js');

const app         = express();
const server      = require('http').Server(app);
const bodyParser  = require('body-parser');

app.use(bodyParser.json());

routes(app);

module.exports = server;