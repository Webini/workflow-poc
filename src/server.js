const express     = require('express');
const routes      = require('./routes.js');

const app         = express();
const server      = require('http').Server(app);
const bodyParser  = require('body-parser');
const apiRender   = require('./middlewares/apiRender.js');

app.use(bodyParser.json());
app.use(apiRender);

routes(app);

module.exports = server;