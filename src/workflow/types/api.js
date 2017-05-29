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

function addFirstSlash(str) {
  if (str.substr(0, 1) === '/') {
    return str;
  }
  return `/${str}`;
}

function removeLastSlash(str) {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length-1);
  }
  return str;
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
      uri: removeLastSlash(configuration.host) + addFirstSlash(replaceVar(path, data)),
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