import { Client } from '@elastic/elasticsearch'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

export const addAdminCredentials = () => {
    console.log('test')
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