import dotenv from 'dotenv'
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '../.env.test')})

import elasticClient, {createElasticSearchClient, pingElasticSearchClient} from '../../src/elasticsearch-service/client'
import { Client } from '@elastic/elasticsearch'

jest.mock("@elastic/elasticsearch", () => ({
    Client: jest.fn(() => ({
        ping: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(undefined)
    }))
}))

describe('elasticsearch client', () => {
    let elasticClient: Client
    let consoleLogSpy: jest.SpyInstance

    beforeAll(() => {
        consoleLogSpy = jest.spyOn(console, 'log')
    })

    afterAll(async () => {
        if (elasticClient) {
            await elasticClient.close()
        }
        consoleLogSpy.mockRestore()
    })

    it('should initialize a client in development environment', async () => {
        elasticClient = createElasticSearchClient()
        expect(elasticClient).toBeDefined
        expect(consoleLogSpy).toHaveBeenCalled
        expect(consoleLogSpy).toHaveBeenCalledWith('Initializing development elasticsearch client..')
    })

    it('should initialize a client in production environment', async () => {
        const prevEnv = process.env.ENV
        process.env.ENV = 'PROD'
        process.env.ELASTICSEARCH_CLOUD_ID = 'mockCloudId'
        process.env.ELASTICSEARCH_ADMIN_USERNAME = 'mockESUsername',
        process.env.ELASTICSEARCH_ADMIN_PASSWORD ?? 'mockESPw'
        jest.resetModules()
        elasticClient = createElasticSearchClient()
        const consoleLogSpy = jest.spyOn(console, 'log') 
        expect(elasticClient).toBeDefined
        expect(consoleLogSpy).toHaveBeenCalledWith('Initializing production elasticsearch client..')
        process.env.ENV = prevEnv
    })

})
