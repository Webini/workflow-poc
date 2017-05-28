const api = require('../api.js');
const buildDocument = require('../services/buildWorkflowDocument.js');
const makeWorkflow = require('../workflow/workflow.js');
const STATUS = {
  error: 0,
  queued: 1,
  success: 2
};

module.exports = async (message) => {
  const { contentData: event } = message;

  const workflow = await api.getWorkflow({ workflow_id: event.data.workflow_id });
  const apis = await api.getApis({ project_id: workflow.project_id });

  try {
    const document = buildDocument(apis, workflow);
    const result = await makeWorkflow(document)(event.data.content);
    await api.updateMessage({
      message_id: event.objectId,
      body: { 
        result,
        status: STATUS.success
      }
    });
  } catch(e) {
    await api.updateMessage({
      message_id: event.objectId,
      body: {
        error: e.message,
        status: STATUS.error
      }
    });

    throw e;
  }
};