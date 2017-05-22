const Raven = require('raven');

module.exports = Raven.config(
  (process.env.NODE_ENV === 'production' ? process.env.SENTRY_URL : undefined), 
  { captureUnhandledRejections: true }
).install();
