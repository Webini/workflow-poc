const types = require('./types/index.js');
const debug = require('../debug.js');
const Cancel = require('./commands/cancel.js');
const Split = require('./commands/split.js');
const Ignore = require('./commands/ignore.js');
const External = require('./commands/external.js');

function buildServices(serviceFactory, configurations) {
  const services = {};
  Object
    .keys(configurations)
    .forEach((name) => {
      services[name] = serviceFactory(configurations[name] || {}, name);
    })
  ;
  return services;
}

function linkService(service, services) {
  if (!service.link) {
    return;
  }

  Object
    .keys(services)
    .forEach((name) => {
      service.link(name, services[name]);    
    })
  ;
}

function createService(services, serviceFactory, configurations) {
  const service = serviceFactory(null, configurations);
  if (!service) {
    return null;
  }

  linkService(service, services);
  return service;
} 

function defaultExternalCallback() {
  throw new Error('No external callback defined');
}

module.exports = function(definition, externalCallback = defaultExternalCallback) {
  const services = buildServices((conf, name) => {
    return buildServices(types[name], conf || {});
  }, definition.configuration || {});

  Object
    .keys(services)
    .forEach((name) => {
      linkService(services[name], services);
    })
  ;

  async function execute(data, workflow) {
    const servicesStack = services[workflow.type];
    let service = null;
    
    if (!servicesStack) {
      const typeFactory = types[workflow.type];
      if (!typeFactory) {
        throw new Error(`Invalid type ${workflow.type}`);
      }
      
      service = createService(services, types[workflow.type]);
    } else {
      service = servicesStack[workflow.name];
    }
    if (!service) {
      throw new Error(`Cannot found item ${workflow.name} in type stack ${workflow.type}`);
    }

    return await service.execute(workflow.configuration || {}, data);
  }

  debug('Workflow built');
  async function executeAll(data, workflows) {
    workflows = workflows || definition.workflow;
    const result = await workflows
      .reduce(async (promise, workflow, index) => {
        const data = await promise;
        debug('Data received %O', data);
        
        if (data instanceof Ignore) {
          return promise;
        }

        if (data instanceof Cancel) {
          let msg = `Workflow cancelled at step ${index-1}`;
          if (data.hasMessage()) {
            msg += ` with message "${data.getMessage()}"`;
          }
          return new Ignore(msg);
        }
        
        if (data instanceof Split) {
          const subWorkflow = workflows.slice(index);
          const result = data
            .getData()
            .reduce(async (promise, data) => {
              const ret = await promise;
              ret.push(await executeAll(data, subWorkflow));
              return ret;
            }, Promise.resolve([]))
          ;
          return new Ignore(result);
        }

        const result = await execute(data, workflow);

        if (result instanceof External) {
          return await externalCallback.apply(externalCallback, result.getParameters());
        }

        return result;
      }, Promise.resolve(data))
    ;
    
    if (result instanceof Ignore) {
      return result.getData();
    }
    return result;
  }

  //protect workflows arg
  return function(data) {
    return executeAll(data);
  };
};