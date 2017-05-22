const makeJail = require('../../src/sandbox/jail.js');
const Context = require('../../src/sandbox/context.js');
const assert = require('assert');

describe('Jail', () => {
  const jail = makeJail(new Context());

  it('should return 42', async () => {
    assert.deepStrictEqual(await jail('return 42'), 42, 'invalid return');
  });

  it('should wait promise', async () => {
    const result = await jail(`
      return new Promise((resolve) => {
        return resolve(42);
      });
    `);

    assert.deepStrictEqual(result, 42, 'invalid return');
  });

  it('should throw synthaxis error', (done) => {
    jail('class')
      .then(() => done(new Error('Error expected')))
      .catch(() => done())
    ;
  });

  it('cannot access require or process', async () => {
    const result = await jail(`
      return { process, require };
    `);

    assert.deepStrictEqual(result, { process: null, require: null }, 'Invalid result');
  });
});