import { Client } from '@elastic/elasticsearch'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

export const addDocument = async (client: Client, indexName: string, doc: object) => {
    try {
        const indexExists: boolean = await client.indices.exists({ index: indexName })
        
        if (indexExists) {
            const res = await client.index({
                index: indexName,
                body: doc
            })
            return res
        } else {
            console.log(`Index ${indexName} doesn't exist`)
        }
    } catch (err) {
        console.error(`Error adding document to index: ${indexName} `, err)
    }
}

export const createNewIndex = async (client: Client, indexName: string) => {
    try { 
        const indexExists: boolean = await client.indices.exists({ index: indexName })
        
        if (!indexExists) {
            const mapping: Record<string, MappingProperty> = {
                username: { type: 'keyword'},
                password: { type: 'keyword'}
            }
            const res = await client.indices.create({
                index: indexName,
                mappings: {
                    properties: mapping,
                }
            })
            return res
        } else {
            console.log(`Index ${indexName} already exists`)
        }
    } catch(err) {
        console.error(`Error creating index: ${indexName} `, err)
    }
}