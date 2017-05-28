Danger
======

Always answer OK 

Env
===

Variable                | Default        | Description
----------------------- | -------------- | --------------
SERVER_HOST             | localhost      | server host
SERVER_PORT             | 8080           | server port
RABBITMQ_URL            |                | RabbitMQ url (format like `amqp://localhost:5672` )
SENTRY_URL              |                | Sentry url (`https://<key>@sentry.io/<project>`)
EXCHANGE_NAME           | workflow       | name where the workflows request will pop 
QUEUE_NAME              | workflow-messages | name of the binded queue 
WORKFLOW_API_URL            | http://localhost:8080 | workflow api URL
WORKFLOW_API_KEY        |                | workflow api key