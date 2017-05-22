const fs = require('fs');

module.exports = {
  configuration: {
    api: {
      zenhub: {
        host: 'https://api.zenhub.io/',
        headers: [
          {
            name: 'X-Authentication-Token',
            value: 'bba0bb913a82bf0cf74903733c8e779a1f2839517741908f3e4fe7ab47f173b2998341f5c49387c3'
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
      name: 'zenhub',
      configuration: {
        path: '/p1/repositories/:repo_id/issues/:issue_number/moves',
        method: 'POST'
      }
    }
  ]
};