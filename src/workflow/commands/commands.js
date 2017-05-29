const Cancel = require('./cancel.js');
const Split = require('./split.js');

//factory to avoid object modifications in the "sandbox"
module.exports = function() {
  return {
    cancel: function() {
      return new Cancel();
    },
    split: function(data) {
      return new Split(data); 
    }
  };
};