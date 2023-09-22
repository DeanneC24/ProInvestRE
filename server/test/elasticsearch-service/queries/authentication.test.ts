import { getUser } from '../..//../src/elasticsearch-service/queries/authentication'
import { Client } from '@elastic/elasticsearch'

describe('getUser', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return an empty object for a non-existing user', async () => {
        const mockClient = {
        search: jest.fn().mockResolvedValueOnce({
            hits: {
                hits: [],
            },
        }),
        } as unknown as Client

        const username = 'nonexistentuser'
        const user = await getUser(mockClient, username)

        expect(user).toEqual({})
    })

    it('should retrieve an existing user', async () => {
        const username = 'testuser'
        const mockClient = {
            search: jest.fn().mockResolvedValueOnce({
                hits: {
                    hits: [
                        {
                            _source: {
                                username: username,
                            },
                        },
                    ],
                },
            }),
        } as unknown as Client

        const user = await getUser(mockClient, username)

        expect(mockClient.search).toHaveBeenCalledWith({
            index: undefined,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    username: username,
                                },
                            },
                        ],
                    },
                },
            },
        })

        expect(user).toEqual({
                username: username,
        })
    })
})
