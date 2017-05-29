const vm = require('vm');

/**
 * @param {Context} context 
 */
module.exports = (context, timeout = 60) => {
  return function(code) {
    return (async () => {
      const scope = Object.assign({ module: {} }, context.getScope());
      vm.runInNewContext(`'use strict'; module.exports = (async function(){ ${code} })();`, scope, { timeout });
      return await scope.module.exports;
    })();
  };
};