module.exports = class Context {
  constructor() {
    this.scope = {
      require: null,
      process: null,
      global: null,
      eval: null,
      __dirname: null,
      __filename: null,
      module: {}
    };
  }

  /**
   * Add element to context
   * @param {string} name 
   * @param {any} object 
   * @returns {Context}
   */
  add(name, object) {
    this.scope[name] = object;
    return this;
  }

  /**
   * Remove element from context
   * @param {string} name 
   */
  remove(name) {
    delete this.scope[name];
  }

  /**
   * @returns {object} 
   */
  getScope() {
    return this.scope;
  }
};