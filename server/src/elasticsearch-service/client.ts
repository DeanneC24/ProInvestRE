import { Client } from "@elastic/elasticsearch"

export const createElasticSearchClient = () => {
  try {
    if (process.env.NODE_ENV?.toUpperCase() === 'PROD' || process.env.NODE_ENV?.toUpperCase() === 'PRODUCTION') {
      console.log('Initializing production elasticsearch client..')
      return new Client({
        cloud: {
          id: process.env.ELASTICSEARCH_CLOUD_ID ?? ''
        },
        auth: {
          apiKey: process.env.ELASTICSEARCH_ADMIN_APIKEY ?? ''
        }
      })
    } else {
      console.log('Initializing development elasticsearch client..')
      return new Client({
        node: 'http://localhost:5601'
      })
    }
  } catch (err) {
    console.error('Error instantiating elasticsearch client: ', err)
  }
}


export const pingElasticSearchClient = async (elasticClient: Client) => {
    await elasticClient.ping()
    .then(() => console.log(`Elasticsearch client is successfully connected!`))
    .catch(err=>console.error("Elasticsearch client is not connected.", err))
}

const elasticClient = createElasticSearchClient()

export default elasticClient
