const sampleCtrl = require('./controllers/sample.js');

module.exports = (app) => {
  app.post('/', sampleCtrl.process);
};
