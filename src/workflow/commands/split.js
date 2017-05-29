module.exports = class Split {
  constructor(data) {
    this.data = data || [];
    if (!Array.isArray(this.data)) {
      throw new Error('To split workflow, you must use an array');
    }
  }

  /**
   * @returns {Array}
   */
  getData() {
    return this.data;
  }
};