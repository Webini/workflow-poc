const types = require('./types/index.js');
const debug = require('debug')('Workflow');

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
  linkService(service, services);
  return service;
} 

module.exports = function(definition) {
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
      if (!service) {
        throw new Error(`Cannot found item ${workflow.name} in type stack ${workflow.type}`);
      }
    }

    return await service.execute(workflow.configuration || {}, data);
  }

  return async function(data) {
    const workflows = definition.workflow;
    return workflows
      .reduce(async (promise, workflow) => {
        const data = await promise;
        debug('Data received %O', data);
        if (data !== null) { //null body cancel workflow
          return execute(data, workflow);
        } else {
          return promise;
        }
      }, Promise.resolve(data))
    ;
  };
};