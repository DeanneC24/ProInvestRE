import { Client } from "@elastic/elasticsearch"
import { OutcodeSearchResult, RegionOption } from "../../shared/interfaces/elasticsearch"
import { SortOrder } from "@elastic/elasticsearch/lib/api/types"

const searchByOutcode = async (client: Client, outcode: string ): Promise<OutcodeSearchResult | null> => {
    try {
        const body = await client.search({
            index: process.env.ELASTICSEARCH_RENTAL_METRIC_INDEX,
            body: {
                query: {
                    match: {
                        outcode: outcode.toLocaleUpperCase()
                    }
                }
            }
        })
        if(body.hits.hits.length === 1) {
            return body.hits.hits[0]._source as OutcodeSearchResult
        } else if (body.hits.hits.length === 0) {
            console.log(`No results retrieved for ${outcode}`)
            return null
        } else {
            console.error(`Multiple retrieved for outcode ${outcode} found when expecting one`)
            return null
        }
    } catch (err) {
        throw new Error(`Error retrieving data for ${outcode}: ${err}`)
    }
}

const searchByRegion = async (client: Client, region: RegionOption, numOfResults: number, orderBy: SortOrder): Promise<OutcodeSearchResult[] | null> => {
    try {
        const body = await client.search({
            index: process.env.ELASTICSEARCH_RENTAL_METRIC_INDEX,
            body: {
                query: {
                    term: {
                        region: region
                    }
                },
                sort: [
                    {
                        avg_yield: {
                            order: orderBy
                        }
                    }
                ],
                size: numOfResults
            }
        })
        if (body.hits.hits.length === 0) {
            console.log(`No results retrieved for ${region}`)
            return null
        } else {
            const results: OutcodeSearchResult[] = body.hits.hits.map((item:any) => ({
                avg_yield: item._source.avg_yield,
                avg_rent: item._source.avg_rent,
                growth_1y: item._source.growth_1y,
                outcode: item._source.outcode,
                growth_3y: item._source.growth_3y,
                sales_per_month: item._source.sales_per_month,
                avg_price: item._source.avg_price,
                growth_5y: item._source.growth_5y,
                region: item._source.region,
                avg_price_psf: item._source.avg_price_psf,
            }))
            return results
        }
    } catch(err) {
        throw new Error(`Error retrieving data for ${region}: ${err}`)
    }
}

// const getUser = async (client: Client, username: string): Promise<object> => {
//     try {
//         const response = await client.search({
//             index: process.env.ELASTICSEARCH_CREDENTIALS_INDEX,
//             body: {
//                 query: {
//                     bool:{
//                         must:[
//                             {
//                                 match: {
//                                     username: username
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             }
//         })
//         const userExists: boolean = response.hits.hits.length === 1 ? true : false
//         if (!userExists) {
//             console.warn(`User ${username} doesn't exist`)
//             return {}
//         } else {
//             console.log(`Successfully retrieved user ${username}`)
//             return response.hits.hits[0]['_source'] as object
//         }
//     } catch (err) {
//         console.error(`Issue retrieving user ${username} from data store`)
//         throw err
//     }
// }

export { searchByOutcode, searchByRegion }  