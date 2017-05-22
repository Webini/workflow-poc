const createWorkflow = require('../../src/workflow/workflow.js');
const assert = require('assert');
const nock = require('nock');

describe('Workflow', () => {
  it('should process lambdas', async () => {
    const workflow = createWorkflow({
      workflow: [
        { 
          type: 'lambda',
          configuration: {
            code: 'return `${data.firstname} ${data.lastname}`;'
          }
        },
        {
          type: 'lambda',
          configuration: {
            code: 'return `${data} est un lapin.`;'
          }
        }
      ]
    });

    const result = await workflow({ 
      firstname: 'Jean',
      lastname: 'Marcel'
    });

    assert.deepStrictEqual(result, 'Jean Marcel est un lapin.');
  });

  it('should throw error for inexistant type', (done) => {
    const workflow = createWorkflow({
      workflow: [ { type: 'inexistant' } ]
    });

    workflow({})
      .then(() => done(new Error('it should not be a success')))
      .catch(() => done())
    ;
  });

  it('should throw error for inexistant service', (done) => {
    const workflow = createWorkflow({
      configuration: { api: { } },
      workflow: [ { type: 'api', name: 'notfound' } ]
    });

    workflow({})
      .then(() => done(new Error('it should not be a success')))
      .catch(() => done())
    ;
  });

  it('should merge the whole universe', async () => {
    const repositoryId = 42;
    const workflow = createWorkflow({
      configuration: {
        api: {
          zenhub: { host: 'https://zenhub.com' },
          github: { host: 'https://github.com' }
        }
      },
      workflow: [
        {
          type: 'lambda',
          configuration: {
            code: `
              const pipeline = await api.zenhub('GET', '/pipeline/' + data.repositoryId);
              return {
                pipeline_id: pipeline.id,
                repository_id: data.repositoryId,
                comment: 'yolo on ' + pipeline.id
              };
            `
          }
        },
        {
          type: 'api',
          name: 'github',
          configuration: {
            path: '/comment/:repository_id',
            method: 'POST'
          }
        }
      ]
    });


    nock('https://zenhub.com')
      .get(`/pipeline/${repositoryId}`)
      .once()
      .reply(200, { id: 1337 })
    ;

    nock('https://github.com')
      .post(`/comment/${repositoryId}`)
      .once()
      .reply((uri, requestBody) => {
        return [
          200,
          JSON.stringify(requestBody.comment),
          {'content-type': 'application/json'}
        ];
      })
    ;

    const result = await workflow({ repositoryId: 42 });
    assert.strictEqual(result, 'yolo on 1337', 'Invalid result');
  });
});