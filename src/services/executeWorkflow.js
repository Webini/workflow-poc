const api = require('../api.js');
const buildDocument = require('../services/buildWorkflowDocument.js');
const makeWorkflow = require('../workflow/workflow.js');
const Ignore = require('../workflow/commands/ignore.js');

async function execute(originalData, workflow) {
  const apis = await api.getApis({ project_id: workflow.project_id });
  const document = buildDocument(apis, workflow);
  
  async function executeExternal(name, data, cancel = false) {
    const results = await api.searchWorkflows({ 
      body: {
        name,
        project_id: workflow.project_id
      }
    });

    if (results.count > 1) {
      throw new Error(`Too many workflow found for ${name}`);
    } else if (results.count <= 0) {
      throw new Error(`Cannot found workflow ${name}`);
    }

    const result = await execute({ 
      body: data,
      headers: originalData.headers, // oh ho
      query: originalData.query,     // huh huh
      method: originalData.method    // hum hum
    }, results.data[0]);

    if (cancel) {
      return new Ignore(result);
    }

    return result;
  }

  return makeWorkflow(document, executeExternal)(originalData);
}

module.exports = execute;