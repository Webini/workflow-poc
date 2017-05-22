module.exports = function() {
  const server     = require('../server.js');
  const port       = process.env.SERVER_PORT || 8080;
  const host       = process.env.SERVER_HOST || 'localhost';
  const debug      = require('debug')('server');

  return new Promise((resolve, reject) => {
    server.listen(port, host, (err) => {
      if (err) {
        return reject(err);
      }

      debug('Server started on %o:%o', host, port);
      resolve();
    });
  });
};