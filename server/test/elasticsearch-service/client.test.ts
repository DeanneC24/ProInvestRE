import initializeElasticSearchClient from '../../src/elasticsearch-service/client'
import { Client } from '@elastic/elasticsearch';

describe('initializeElasticSearchClient', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize a client in development environment', async () => {
        process.env.ENV = 'DEV'
        const client: Client = await initializeElasticSearchClient('admin')
        expect(client).toBeDefined()
    })
})
