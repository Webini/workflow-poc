const url = require('url');
const request = require('request-promise-native');

/**
 * @param {Array.<{name,value}>} elements array with keyval 
 * @returns 
 */
function makeMap(elements) {
  return elements
    .reduce((object, el) => {
      object[el.name] = el.value;
      return object;
    }, {})
  ;
}

/**
 * @param {string} path 
 * @param {Object} data 
 * @returns {string}
 */
function replaceVar(path, data) {
  return path.replace(/:([a-z_]+)/ig, (fullMatch, partialMatch) => {
    if (data[partialMatch]) {
      return data[partialMatch];
    }
    return fullMatch;
  });
}

module.exports = function(configuration, name) {
  if (!configuration) {
    return null;
  }
  
  const headers = makeMap(configuration.headers || []);
  const query = makeMap(configuration.qs || []);

  async function callServer(method, path, data = {}, conf = { qs: {} }) {
    return request({
      headers: headers,
      uri: url.resolve(configuration.host, replaceVar(path, data)),
      json: true,
      method: method,
      body: data,
      qs: Object.assign(query, conf.qs)
    });
  }

  /**
   * @param {Object.<path, method>} configuration 
   * @param {any} data data to pass
   * @returns 
   */
  async function execute(configuration = {}, data) {
    return callServer(configuration.method || 'GET', configuration.path, data, { qs: configuration.qs || {} });
  }

  return {
    execute,
    expose: callServer
  };
};