Lambda API
==========

## Variables 

Name | Value
---- | -----
data | Previous data 
data.{body,headers,query,method}  | This fields are available if this is the first message

## Methods

Name | Parameters | Action
---- | ---------- | -------
workflow.split(datas) | array | Each element passed to workflow.split will start the same workflow at the current step + 1. The data will be hydrated with array item.
workflow.cancel(message) | string | Cancel the workflow
async api[api defined in the project](method, path, body) | string, string, object | Make an api call  

Env
===

Variable                | Default        | Description
----------------------- | -------------- | --------------
RABBITMQ_URL            |                | RabbitMQ url (format like `amqp://localhost:5672` )
SENTRY_URL              |                | Sentry url (`https://<key>@sentry.io/<project>`)
EXCHANGE_NAME           | workflow       | name where the workflows request will pop 
QUEUE_NAME              | workflow-messages | name of the binded queue 
WORKFLOW_API_URL        | http://localhost:8080 | workflow api URL
WORKFLOW_API_KEY        |                | workflow api key