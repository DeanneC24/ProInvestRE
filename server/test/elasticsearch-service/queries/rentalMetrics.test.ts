import { Client } from "@elastic/elasticsearch"
import { searchByOutcode, searchByRegion } from "../../../src/elasticsearch-service/queries/rentalMetrics"

describe("searchByOutcode", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should return null when no results are found", async () => {
        // Given an elasticsearch client search response with no hits
        const mockClient = {
            search: jest.fn().mockResolvedValueOnce({
                hits: {
                    hits: [],
                },
            }),
        } as unknown as Client
    
        // When
        const result = await searchByOutcode(mockClient, "mockOutcode")
    
        // Then
        expect(result).toBeNull()
      })

      it("should return the expected result when one result is found", async () => {
        // Given an elasticsearch client search response with one hit
        const mockOutcodeDocument = {
            avg_yield: 10,
            avg_rent: 1000,
            growth_1y: 0.1,
            outcode: 'validOutcode',
            growth_3y: 2.3,
            sales_per_month: 20,
            avg_price: 676000,
            growth_5y: 8.4,
            region: 'mock_region',
            avg_price_psf: 7.6
        }
        const mockClient = {
            search: jest.fn().mockResolvedValueOnce({
                hits: {
                    hits:  [
                        {
                            _source: mockOutcodeDocument
                        },
                    ],
                },
            }),
            } as unknown as Client
    
        // When
        const result = await searchByOutcode(mockClient, "validOutcode")
            
        // Then the result should be the matching document
        expect(result).toEqual(mockOutcodeDocument)
    })

    it("should throw an error on Elasticsearch error", async () => {
        // Given an elasticsearch search error
        const mockClient = {
            search: jest.fn().mockRejectedValue(new Error("Elasticsearch error")),
        } as unknown as Client
    
        // When searchByOutcode, Then an error with the following message is thrown
        await expect(searchByOutcode(mockClient, "validOutcode")).rejects.toThrowError(
          "Error retrieving data for validOutcode: Error: Elasticsearch error"
        )
    })
})

describe("searchByRegion", () => {
    const validResponse = [
        {
            _source:  {
                avg_yield: 2.5,
                avg_rent: 1073.9,
                growth_1y: -11.5,
                outcode: "W1",
                growth_3y: -0.5,
                sales_per_month: 25,
                avg_price: 2241883.2,
                growth_5y: -14.1,
                region: "south_east",
                avg_price_psf: 1786.65,
            },
        },
    ]
        

    it("should return null for a region with no data", async () => {
        // Given an elasticsearch client search response with no hits
        const mockClient = {
            search: jest.fn().mockResolvedValueOnce({
                hits: {
                    hits:  [],
                },
            }),
        } as unknown as Client
        // When
        const result = await searchByRegion(mockClient, 'south_east', 2, 'asc')
        // Then the result should be null
        expect(result).toBeNull()
    })

    it("should return search results for a valid region", async () => {
        // Given an elasticsearch client search response with a list of hits
        const mockClient = {
        search: jest.fn().mockResolvedValueOnce({
            hits: {
                hits: validResponse
            },
        }),
        } as unknown as Client
        // When
        const result = await searchByRegion(mockClient, 'south_east', 5, 'asc')
        // Then 
        expect(result).toEqual([validResponse[0]._source])
    })
    
})