import { Client } from "@elastic/elasticsearch";

const initializeElasticSearchClient = (userRole: String) => {

    let client: Client
    if (userRole === 'admin') {
        client = new Client({
            cloud: {
              id: process.env.ELASTICSEARCH_CLOUD_ID ?? '',
            },
            auth: {
              username: process.env.ELASTICSEARCH_ADMIN_USERNAME ?? '',
              password: process.env.ELASTICSEARCH_ADMIN_PASSWORD ?? '',
            },
          })
    } else {
        client = new Client({
            cloud: {
              id: process.env.ELASTICSEARCH_CLOUD_ID ?? '',
            },
            auth: {
              username: process.env.ELASTICSEARCH_PUBLIC_USERNAME ?? '',
              password: process.env.ELASTICSEARCH_PUBLIC_PASSWORD ?? '',
            },
          });
    }
    client.ping()
        .then(response => console.log("You are connected to Elasticsearch!"))
        .catch(error => console.error("Elasticsearch is not connected."))
}

export default initializeElasticSearchClient;  