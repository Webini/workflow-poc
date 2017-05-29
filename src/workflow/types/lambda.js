const makeJail = require('../../sandbox/jail.js');
const Context = require('../../sandbox/context.js');
const createCommands = require('../commands/commands.js');

module.exports = function() {
  const context = new Context();
  const jail = makeJail(context);

  async function execute(configuration, data) {
    context.add('data', data);
    context.add('workflow', createCommands());
    return await jail(configuration.code);
  }

  function link(stackName, services) {
    const stack = {};

    Object
      .keys(services)
      .forEach((name) => {
        const service = services[name];
        if (service.expose) {
          stack[name] = service.expose;
        }
      })
    ;

    context.add(stackName, stack);
  }

  return {
    link,
    execute
  };
};