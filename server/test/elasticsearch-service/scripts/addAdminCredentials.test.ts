import { Client } from '@elastic/elasticsearch'
import Mock from '@elastic/elasticsearch-mock'
import { createNewIndex } from '../../../src/elasticsearch-service/scripts/addAdminCredentials'

const indexName: string = 'users'
const adminDocId: number = 1
const adminUsername: string = 'test-admin-username'
const adminPassword: string = 'test-admin-password'

describe("Elasticsearch requests to add new index users index", () => {
    let client: Client

    beforeAll(() => {
        const mock: Mock = new Mock()
        client = new Client({
            node: 'http://localhost:9200',
            Connection: mock.getConnection()
        })
        mock.add({
            method: 'PUT',
            path: `/${indexName}`,
        }, () => {
            return { status: 'ok' }
        })
    })

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it(`Should create a new index called users`, async () => {
        const res = await createNewIndex(client, indexName)
        expect(res).toEqual({ status: 'ok' })
    })


    it("Should handle errors gracefully", async () => {
        const errorSpy = jest.spyOn(console, 'error');
        client.indices.create = jest.fn().mockRejectedValue(new Error('Elasticsearch error'))
        const res = await createNewIndex(client, indexName)
        expect(res).toBeUndefined()
        expect(errorSpy).toHaveBeenCalled()
    })

    it(`Shouldn't create a new index when one exists`, async () => {
        const createSpy = jest.spyOn(client.indices, 'create')
        client.indices.exists = jest.fn().mockResolvedValue({ body: true })
        const res = await createNewIndex(client, indexName)
        expect(res).toBeUndefined()
        expect(createSpy).not.toHaveBeenCalled()
    })
})




