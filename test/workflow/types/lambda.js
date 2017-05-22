const assert = require('assert');
const makeLambda = require('../../../src/workflow/types/lambda.js');

describe('Workflow type lambda', () => {
  it('should execute with context', async () => {
    const lambda = makeLambda();
    lambda.link('api', {
      test: {
        expose: 40
      }
    });

    const result = await lambda.execute({ code: 'return api.test + data.test;' }, { test: 2 });
    assert.deepStrictEqual(result, 42, 'invalid result');
  });
});