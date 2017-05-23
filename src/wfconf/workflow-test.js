const fs = require('fs');

module.exports = {
  configuration: {
    api: {
      github: {
        host: 'https://api.github.com/',
        headers: [
          {
            name: 'Authorization',
            value: `token ${process.env.GITHUB_TOKEN}`
          },
          {
            name: 'user-agent',
            value: 'Webini workflow'
          }
        ]
      }
    }
  },
  workflow: [
    {
      type: 'lambda',
      configuration: {
        code: fs.readFileSync(`${__dirname}/lambda.js`)
      }
    },
    {
      type: 'api',
      name: 'github',
      configuration: {
        path: '/repos/:owner/:repo/issues/:number/comments',
        method: 'POST'
      }
    }
  ]
};