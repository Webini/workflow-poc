'use strict';

const fs        = require('fs');
const path      = require('path');
const basename  = path.basename(module.filename);
const commands  = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    commands[path.basename(file, path.extname(file))] = require(path.join(__dirname, file));
  })
;

module.exports = commands;
