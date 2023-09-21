import initializeElasticSearchClient from '../../src/elasticsearch-service/client'
import { Client } from '@elastic/elasticsearch';

describe('initializeElasticSearchClient', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize a client in development environment', () => {
        process.env.ENV = 'DEV'
        const client: Client = initializeElasticSearchClient('admin')

        // Add assertions here to test if the client is initialized correctly for the admin role in dev environment
        expect(client).toBeDefined();
        // Add more specific assertions as needed
    });

});
