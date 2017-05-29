module.exports = (apis, workflow) => {
  const doc = {
    workflow: workflow.configuration
  };

  doc.api = (apis.data || []).reduce((apis, api) => {
    apis[api.name] = {
      host: api.host,
      qs: Object
        .keys(api.qs || {})
        .map((name) => ({
          name,
          value: api.headers[name]
        })),
      headers: Object
        .keys(api.headers || {})
        .map((name) => ({
          name,
          value: api.headers[name]
        }))
    };
    return apis;
  }, {});
  
  return doc;
};