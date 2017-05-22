/**
 * @param {Context} context 
 */
module.exports = (context) => {
  const scope = context.getScope();
  return function(code) {
    return (async () => {
      with (scope) {
        return await eval(
          `(async function(){ ${code} }())` 
        );
      }
    })();
  };
};