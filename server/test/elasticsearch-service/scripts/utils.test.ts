import { Client } from '@elastic/elasticsearch'
import Mock from '@elastic/elasticsearch-mock'
import { createNewIndex, addDocument } from '../../../src/elasticsearch-service/scripts/utils'

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

    it(`it should create a new index called users`, async () => {
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

describe("Elasticsearch request to add admin credentials to the users index", () => {
    let client: Client

    beforeAll(() => {
        const mock: Mock = new Mock()
        client = new Client({
            node: 'http://localhost:9200',
            Connection: mock.getConnection()
        })
        mock.add({
            method: ['PUT', 'POST'],
            path: `/${indexName}/_doc/`, // Add new user with id 1
            body: {
                username : adminUsername,
                password: adminPassword
            }
        }, () => {
            return { status: 'ok' }
        })
    })

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it(`it should throw an error if the index doesn't exist`, async () => {
        const userDoc = {
            username: adminUsername,
            password: adminPassword
        }
        const logSpy = jest.spyOn(console, 'log');
        const res = await addDocument(client, 'users', userDoc)
        expect(res).toBeUndefined()
        expect(logSpy).toHaveBeenCalledWith("Index users doesn't exist")
    })
    
    it(`it should add a new document in users for admin user`, async () => {
        const userDoc = {
            username: adminUsername,
            password: adminPassword
        }
        client.indices.exists = jest.fn().mockResolvedValue({ body: true })
        const res = await addDocument(client, 'users', userDoc)
        expect(res).toEqual({ status: 'ok' })
    })
})


