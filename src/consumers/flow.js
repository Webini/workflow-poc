const api = require('../api.js');
const executeWorkflow = require('../services/executeWorkflow.js');

const STATUS = {
  error: 0,
  queued: 1,
  success: 2
};

module.exports = async (message) => {
  const { contentData: event } = message;
  const workflow = await api.getWorkflow({ workflow_id: event.data.workflow_id });
  
  try {
    const result = await executeWorkflow(event.data.content, workflow);
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