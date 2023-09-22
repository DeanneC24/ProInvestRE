import initializeElasticSearchClient from '../../src/elasticsearch-service/client'
import { Client } from '@elastic/elasticsearch';

describe('initializeElasticSearchClient', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize a client in development environment', () => {
        process.env.ENV = 'DEV'
        const client: Client = initializeElasticSearchClient('admin')
        expect(client).toBeDefined()
    });

});
