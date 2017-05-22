const fs        = require('fs');
const path      = require('path');
const basename  = path.basename(module.filename);
const types     = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    types[path.basename(file, path.extname(file))] = require(path.join(__dirname, file));
  })
;

module.exports = types;
