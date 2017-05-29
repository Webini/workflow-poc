module.exports = class Cancel {
  constructor(message) {
    this.message = '';
    if (message) {
      this.message = message.toString();
    }
  }

  hasMessage() {
    return this.message && this.message.length > 0;
  }

  getMessage() {
    return this.message;
  }
};