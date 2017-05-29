const Cancel = require('./cancel.js');
const Split = require('./split.js');

//factory to avoid object modifications in the "sandbox"
module.exports = function() {
  return {
    cancel: function(message = null) {
      return new Cancel(message);
    },
    split: function(data) {
      return new Split(data); 
    }
  };
};