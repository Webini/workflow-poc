module.exports = async (message) => {
  const { contentData: event } = message;
  const eventName = message.fields.routingKey;

};