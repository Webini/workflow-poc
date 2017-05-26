const makeJail = require('../../src/sandbox/jail.js');
const Context = require('../../src/sandbox/context.js');
const assert = require('assert');

describe('Jail', () => {

  it('should return 42', async () => {
    const jail = makeJail(new Context());
    assert.deepStrictEqual(await jail('return 42'), 42, 'invalid return');
  });

  it('should wait promise', async () => {
    const jail = makeJail(new Context());
    const result = await jail(`
      return new Promise((resolve) => {
        return resolve(42);
      });
    `);

    assert.deepStrictEqual(result, 42, 'invalid return');
  });

  it('should throw synthaxis error', (done) => {
    const jail = makeJail(new Context());
    jail('class')
      .then(() => done(new Error('Error expected')))
      .catch(() => done())
    ;
  });

  it('cannot access require or process', async () => {
    const jail = makeJail(new Context());
    const result = await jail(`
      return { process, require, global, eval, module };
    `);

    assert.deepEqual(result.process, null, 'invalid process value');
    assert.deepEqual(result.require, null, 'invalid require value');
    assert.deepEqual(result.global, null, 'invalid global value');
    assert.deepEqual(result.eval, null, 'invalid eval value');
  });
});