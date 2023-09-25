import { Client } from "@elastic/elasticsearch"

export const createElasticSearchClient = () => {
  if (process.env.ENV?.toUpperCase() === 'DEV') {
    console.log('Initializing development elasticsearch client..')
    return new Client({
      node: 'http://localhost:5601'
    })
  } else {
    console.log('Initializing production elasticsearch client..')
    return new Client({
      cloud: {
        id: process.env.ELASTICSEARCH_CLOUD_ID ?? ''
      },
      auth: {
        username: process.env.ELASTICSEARCH_ADMIN_USERNAME ?? '',
        password: process.env.ELASTICSEARCH_ADMIN_PASSWORD ?? ''
      }
    })
  }
}


export const pingElasticSearchClient = async (elasticClient: Client) => {
    await elasticClient.ping()
    .then(() => console.log(`Elasticsearch client is successfully connected!`))
    .catch(err=>console.error("Elasticsearch client is not connected.", err))
}

const elasticClient = createElasticSearchClient()

export default elasticClient
