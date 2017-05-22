const apiConstraints     = require('./middlewares/apiConstraints.js');
const sampleCtrl         = require('./controllers/sample.js');

module.exports = (app) => {
  app.post('/sample/:hash([a-zA-Z0-9]{40})', 
    sampleCtrl.search
  );
};
