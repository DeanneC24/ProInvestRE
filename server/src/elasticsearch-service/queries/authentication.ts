import { Client } from "@elastic/elasticsearch"

const test = async (client: Client ) => {
    const response = await client.ping()
    console.log(' Successfully pinged client')
}

const checkIndexExists = async (client: Client, indexName: string ) => {
    try {
        const response = await client.indices.exists({ index: indexName });
        console.log(`Index ${indexName} exists? ${response}`)
        return response;
    } catch (error) {
        console.error(`Error checking index ${indexName} existence: ${error}`);
        return false;
    }
}

const getUser = async (client: Client, username: string): Promise<object> => {
    try {
        const response = await client.search({
            index: process.env.ELASTICSEARCH_CREDENTIALS_INDEX,
            body: {
                query: {
                    bool:{
                        must:[
                            {
                                match: {
                                    username: username
                                }
                            }
                        ]
                    }
                }
            }
        })
        const userExists: boolean = response.hits.hits.length === 1 ? true : false
        if (!userExists) {
            console.warn(`User ${username} doesn't exist`)
            return {}
        } else {
            console.log(`Successfully retrieved user ${username}`)
            return response.hits.hits[0]
        }
    } catch (err) {
        console.error(`Issue retrieving user ${username} from data store`)
        throw err
    }
}

// const addUsersIndex = async (client: Client) => {
//     try {
//         const response = await client.indices.create({
//             index: 'users',
//             mappings: {
//                 properties: {
//                     username: {
//                         type: 'keyword'
//                     },
//                     password: {
//                         type: 'keyword'
//                     }
//                 }
//             }
//         })
//         return response
//     } catch (err) {
//         console.error('Error creating index: ', err)
//     }
// }

export { getUser, test, checkIndexExists }  