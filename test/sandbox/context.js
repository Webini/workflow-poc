const Context = require('../../src/sandbox/context.js');
const assert  = require('assert');

describe('Context', () => {
  it('should add element to context', () => {
    const context = new Context();
    context.add('test', 'lala');
    assert.strictEqual(context.getScope()['test'], 'lala');
  });

  it('should remove element from context', () => {
    const context = new Context();
    context.add('test', 'lala');
    context.remove('test');

    assert.strictEqual(context.getScope()['test'], undefined);
  });

  it('should not allow require or process access', () => {
    const context = new Context();
    const scope = context.getScope();
    assert.strictEqual(scope['require'], null);
    assert.strictEqual(scope['process'], null);
  });
});