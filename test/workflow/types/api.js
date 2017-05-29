const nock = require('nock');
const assert = require('assert');
const makeApi = require('../../../src/workflow/types/api.js');

describe('Workflow type Api', () => {
  it('should add headers', async () => {
    const api = makeApi({
      host: 'http://sample.com/',
      headers: [
        { 
          name: 'test',
          value: 42
        }
      ]
    }, 'test');
    
    nock('http://sample.com')
      .get('/test/1')
      .once()
      .reply(function(uri, requestBody) {
        return [
          200,
          JSON.stringify({ success: this.req.headers.test === 42 }),
          {'content-type': 'application/json'} // optional headers
        ];
      })
    ;

    const result = await api.execute({
      path: '/test/:id',
      method: 'GET'
    }, { id: 1 });

    assert.strictEqual(result.success, true, 'Invalid result');
  });

  it('should set query string', async () => {
    const api = makeApi({
      host: 'http://sample.com/',
      headers: [ { name: 'test', value: 42 } ],
      qs: [ { name: 'apiToken', value: 1337 }]
    }, 'test');

    nock('http://sample.com')
      .get(/^\/test\/1\?.*$/)
      .once()
      .reply(function(uri, requestBody) {
        return [
          200,
          JSON.stringify({ success: this.req.path === '/test/1?apiToken=1337&a=134' }),
          {'content-type': 'application/json'} // optional headers
        ];
      })
    ;

    const result = await api.execute({
      path: '/test/:id',
      method: 'GET',
      qs: { a: 134 }
    }, { id: 1 });

    assert.strictEqual(result.success, true, 'Invalid result');
  });
});