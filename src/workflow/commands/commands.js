const Cancel = require('./cancel.js');
const Split = require('./split.js');
const External = require('./external.js');

//factory to avoid object modifications in the "sandbox"
module.exports = function() {
  return {
    cancel: function(message = null) {
      return new Cancel(message);
    },
    split: function(data) {
      return new Split(data); 
    },
    external: function() {
      return new External(arguments);
    }
  };
};