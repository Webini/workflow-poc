const Raven       = require('../raven.js');
const { connect } = require('amqplib');
const promise     = connect(process.env.RABBITMQ_URL);
const debug       = require('debug')('rabbitmq');

module.exports = {
  /**
   * Create and assert a channel & a new exchange
   * @param {String} exchangeName 
   * @param {Object} { prefetch=null, prefetchGlobal=true, type='topic', exchangeOptions } ExchangeOptions are http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertExchange
   * @returns {Promise.<{channel, exchange, publish}>}
   */
  createChannelAndExchange: async function(exchangeName, { prefetch=null, prefetchGlobal=true, type='topic', exchangeOptions }) {
    debug('Creating channel and asserting exchange %o', exchangeName);
    const channel = await this.createChannel(prefetch, prefetchGlobal);
    const publish = this.createPublish(channel, exchangeName);
    await channel.assertExchange(exchangeName, type, exchangeOptions);
    
    return { channel, exchange: exchangeName, publish };
  },

  /**
   * @param {Object} channel 
   * @param {String} exchangeName 
   * @returns {function}
   */
  createPublish: function(channel, exchangeName) {
    debug('Creating publish for exchange %o', exchangeName);
    /**
     * @param {string} routingKey 
     * @param {any} content 
     * @returns {Boolean}
     */
    return function(routingKey, content, objectId) {
      debug('Message published on exchange %o with pattern %o', exchangeName, routingKey);
      return channel.publish(exchangeName, routingKey, new Buffer(JSON.stringify({
        date: new Date(),
        objectId: objectId || (content && content.id ? content.id : null),
        data: content
      })));
    };
  },

  /**
   * @param {number} [prefetch=null] 
   * @param {boolean} [prefetchGlobal=true] 
   * @returns 
   */
  createChannel: async function(prefetch=null, prefetchGlobal=true) {
    debug('Creating channel with %d prefetch', prefetch);
    const channel = await (await promise).createChannel();

    if (prefetch !== null) {
      await channel.prefetch(prefetch, prefetchGlobal);
    }

    return channel;
  },

  /**
   * Create and bind exchange @exchangeName to @destExchangeName using routingPattern
   * @param {Object} channel 
   * @param {String} exchangeName 
   * @param {String} destExchangeName 
   * @param {Object} { routingPattern='#', type='topic', exchangeOptions } 
   */
  assertAndBindExchange: async function(channel, exchangeName, destExchangeName, { routingPattern='#', type='topic', exchangeOptions }) {
    debug('Assert exchange %o and bind %o to %o', exchangeName, routingPattern, destExchangeName);
    await channel.assertExchange(exchangeName, type, exchangeOptions);
    await Promise.all(
      routingPattern
        .split(' ')
        .map((key) => {
          return channel.bindExchange(destExchangeName, exchangeName, key);
        })
    );
  },

  /**
   * @param {Object} channel 
   * @param {String} queueName 
   * @param {String} exchangeName 
   * @param {Object} { autoDlx=false, routingPattern='#', queueOptions={} } queueOptions are http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertQueue
   * @returns {Promise.<String>}
   */
  assertAndBindQueue: async function(channel, queueName, exchangeName, { autoDlx=false, routingPattern='#', queueOptions={} } ) {
    debug('Assert exchange %o and bind %o to queue %o', exchangeName, routingPattern, queueName);
    if (autoDlx) {
      if (!queueOptions.arguments) {
        queueOptions.arguments = {};
      }

      const dlxExchange = queueOptions.arguments['x-dead-letter-exchange'] || `${exchangeName}.dlx`;
      const dlxRoutingKey = queueOptions.arguments['x-dead-letter-routing-key'] || queueName;
      const dlxQueue = `${queueName}.dlx`;

      queueOptions.arguments['x-dead-letter-exchange'] = dlxExchange;
      queueOptions.arguments['x-dead-letter-routing-key'] = dlxRoutingKey;

      await channel.assertExchange(dlxExchange, 'topic', { durable: true });
      await this.assertAndBindQueue(channel, dlxQueue, dlxExchange, { routingPattern: dlxRoutingKey, durable: true });
    }
    
    await channel.assertQueue(queueName, queueOptions);
    await Promise.all(
      routingPattern
        .split(' ')
        .map((key) => {
          return channel.bindQueue(queueName, exchangeName, key);
        })
    );

    return queueName;
  },

  
  /**
   * @param {Object} channel 
   * @param {String} queueName 
   * @param {Function} callback function(message, channel) 
   * @returns {Promise}
   */
  consume: async function(channel, queueName, callback) {
    debug('Create consumer queue for channel %o', queueName);
    return await channel.consume(queueName, (msg) => {
      debug('Message received on queue %o with key %o', queueName, msg.fields.routingKey);
      msg.contentData = JSON.parse(msg.content);

      const result = callback(msg, channel);
      if (result && result.then && result.catch) {
        result
          .then(() => {
            channel.ack(msg);
          })
          .catch((e) => {
            channel.nack(msg, false, !msg.fields.redelivered);
            Raven.captureException(e, { extra: { event: msg } }, () => {
              console.log(e);
              process.exit(1);
            });
          })
        ;
      }
    });
  }
};