const connection = require('./connection.js');

/**
 * @returns {Promise.<{ channel, exchange, publish }>} 
 */
async function create() {
  const exchange = process.env.EXCHANGE_NAME || 'workflow';
  const { channel, publish } = await connection.createChannelAndExchange(
    exchange, 
    {
      prefetch: 5, 
      prefetchGlobal: true,
      exchangeOptions: {
        durable: true,
        autoDelete: false
      },
      type: 'topic'
    }
  );

  return { channel, publish, exchange };
}

module.exports = create();