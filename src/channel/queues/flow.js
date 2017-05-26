const EventEmitter = require('events');
const connection = require('../connection.js');
const channelPromise = require('../workflow.js');
const consumer = require('../../consumers/flow.js');
const QUEUE_NAME = 'workflow-consumers';

async function create() {
  const { channel, exchange } = await channelPromise;

  const queue = await connection.assertAndBindQueue(channel, QUEUE_NAME, exchange, {
    autoDlx: true,
    queueOptions: {
      autoDelete: false,
      durable: true
    }
  });

  const emitter = new EventEmitter();
  await connection.consume(channel, queue, (msg, channel) => {
    emitter.emit(msg.fields.routingKey, msg, channel);
    return consumer(msg, channel);
  });

  return { queue, emitter };
}

module.exports = create();