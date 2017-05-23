const makeWorkflow = require('../workflow/workflow.js');
const definition = require('../wfconf/workflow-test.js');

module.exports = {
  process: async (req, res) => {
    try {
      const workflow = makeWorkflow(definition);
      const result = await workflow({
        body: req.body,
        headers: req.headers
      });
      res.json(result).send();
    } catch(e) {
      console.log(e);
      res.status(500).send();
    }
  }
};