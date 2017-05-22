const url = require('url');
const request = require('request-promise-native');

/**
 * @param {Array.<{name,value}>} headers 
 * @returns 
 */
function makeHeaders(headers) {
  return headers
    .reduce((object, header) => {
      object[header.name] = header.value;
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
  const headers = makeHeaders(configuration.headers || []);

  async function callServer(method, path, data = {}) {
    return request({
      headers: headers,
      uri: url.resolve(configuration.host, replaceVar(path, data)),
      json: true,
      method: method,
      body: data,
    });
  }

  /**
   * @param {Object.<path, method>} configuration 
   * @param {any} data data to pass
   * @returns 
   */
  async function execute(configuration, data) {
    return callServer(configuration.method || 'GET', configuration.path, data);
  }

  return {
    execute,
    expose: callServer
  };
};