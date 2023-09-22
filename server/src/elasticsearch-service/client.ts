import { Client } from "@elastic/elasticsearch";

const initializeElasticSearchClient = () => {

  if (process.env.ENV?.toUpperCase() === 'DEV') {
    // Initialise connection to local elasticsearch connection
    return new Client({
      node: 'http://localhost:5601'
    })
  } else {
    // Initialise connection to cloud deployment
    return new Client({
      cloud: {
        id: process.env.ELASTICSEARCH_CLOUD_ID ?? ''
      },
      auth:{
        username: process.env.ELASTICSEARCH_ADMIN_USERNAME ?? '',
        password: process.env.ELASTICSEARCH_ADMIN_PASSWORD ?? ''
      }
    })
  }
}

const elasticClient = initializeElasticSearchClient()

elasticClient.ping()
  .then(() => console.log(`Elasticsearch client is successfully connected!`))
  .catch(error => console.error("Elasticsearch client is not connected.", error))

export default elasticClient