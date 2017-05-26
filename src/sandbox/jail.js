const vm = require('vm');

/**
 * @param {Context} context 
 */
module.exports = (context, timeout = 60) => {
  const scope = context.getScope();

  return function(code) {
    return (async () => {
      vm.runInNewContext(`'use strict'; module.exports = (async function(){ ${code} })();`, scope, { timeout });
      return await scope.module.exports;
    })();
  };
};