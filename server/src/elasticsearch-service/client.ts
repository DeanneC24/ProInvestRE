import { Client } from "@elastic/elasticsearch";

const initializeElasticSearchClient = (userRole: string) => {
  const cloudId = process.env.ELASTICSEARCH_CLOUD_ID ?? ''
  let username: string
  let password: string
  let client: Client

  // If dev environment, override userRole to 'dev' to use local installation of elasticsearch
  if (process.env.ENV?.toUpperCase() === 'DEV') {
    client = new Client({
      node: 'http://localhost:5601' // Todo: Remove hardcoded
    })
    console.log(`Number of connections: ${client.transport.connectionPool.connections.length}`)
    console.log(`You're connected to the dev elasticsearch cluster at ${client.transport.connectionPool.connections[0].url.href}`)
  } else {
    if (userRole === 'admin') {
      username = process.env.ELASTICSEARCH_ADMIN_USERNAME ?? '',
      password = process.env.ELASTICSEARCH_ADMIN_PASSWORD ?? ''
    }  else {
      username = process.env.ELASTICSEARCH_PUBLIC_USERNAME ?? ''
      password = process.env.ELASTICSEARCH_PUBLIC_PASSWORD ?? ''
    }
  
    client = new Client({
      cloud: {
        id: cloudId
      },
      auth: {
        username: username,
        password: password
      }
    })
  }

  client.ping()
      .then(response => console.log(`You are connected to Elasticsearch as ${userRole}!`))
      .catch(error => console.error(`Unable to connect to Elasticsearch ${userRole}.`))

  return client
}

export default initializeElasticSearchClient
