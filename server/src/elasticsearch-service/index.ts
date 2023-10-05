import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { test, getUser, checkIndexExists } from './queries/authentication'
import elasticClient, {pingElasticSearchClient} from './client'
import { searchByOutcode, searchByRegion } from './queries/rentalMetrics'
import { Sort, SortOrder } from "@elastic/elasticsearch/lib/api/types"
import { RegionOption } from '../shared/interfaces/elasticsearch';


const elasticsearchService = express()
const PORT = 8040
elasticsearchService.use(bodyParser.json());
elasticsearchService.use(cors())

// check elastic Client is connected
if(elasticClient) {
    pingElasticSearchClient(elasticClient)
} else {
    console.warn('No connection to elasticsearch')
}

// Middleware to handle api requests when elasticsearch is down
elasticsearchService.use(async (req, res, next) => {
    try{
        if (!elasticClient) {
            throw new Error('Elasticsearch is not connected')
        }
        await pingElasticSearchClient(elasticClient)
        next()
    } catch (error) {
        const errorMessage = 'An error occurred establishing a connection to elasticsearch'
        console.warn(errorMessage)
        const resObj = {
            status: 'error',
            error: error || errorMessage
        }
        return res.status(503).json(resObj)
    }
})

elasticsearchService.get('/', async (req, res)  => {
    res.send('Hello World from elasticsearchService')
})

elasticsearchService.get('/search-by-outcode', async (req, res) => {
    const passedOutcode = req.query.outcode as string
    try {
        const searchResults = await searchByOutcode(elasticClient!, passedOutcode)
        const resObj = {
            status: 'success',
            data: searchResults
        }
        res.json(resObj)
    } catch (err) {
        const errorMsg = `Error when retrieving data for ${passedOutcode}`
        console.log(errorMsg)
        const resObj = {
            status: 'error',
            message: errorMsg
        }
        res.status(500).json(resObj)
    }
})


elasticsearchService.get('/search-by-region', async (req, res) => {
    const passedRegion = req.query.region as RegionOption
    const passedOrderBy = req.query.orderBy as SortOrder
    const passedNumOfResults = req.query.numOfResults as string
    const numOfResultsAsNum = Number(passedNumOfResults)

    try {
        const searchResults = await searchByRegion(elasticClient!, passedRegion, numOfResultsAsNum, passedOrderBy)
        const resObj = {
            status: 'success',
            data: searchResults
        }
        res.json(resObj)
    } catch(err) {
        const errMsg = `Error when retrieving data for ${passedRegion}: ${err}`
        console.log(errMsg)
        const resObj = {
            status: 'error',
            message: errMsg
        }
        res.status(500).json(resObj)
    }
})


elasticsearchService.get('/user-index-exists', async (req, res) => {
    try {
        const usersIndexExists = await checkIndexExists(elasticClient!, 'users')
        console.log(`From index ${usersIndexExists}`)
        res.json(String(usersIndexExists))
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'An error occurred' })
    }
})

elasticsearchService.get('/getUser', async (req, res) => {
    // todo improve error handling with http responses
    try {
        const username: string | undefined  = req.query.username as string | undefined
        console.log(typeof username)
        console.log(username)
        if (typeof username !== 'undefined') {
            const user: object = await getUser(elasticClient!, username)
            res.json(user)
        }
    } catch (err) {
        console.error(`Issue retrieving user from data store: `, err)
        res.status(500).json({ error: 'An error occurred'})
    }
})


elasticsearchService.listen(PORT, () => {
    console.log(`Elasticsearch service is running on http://localhost:${PORT}`)
})

export default elasticsearchService


// elasticsearchService.get('/search-by-region-stub', async (req, res) => {
//     const passedRegion = req.query.region as string
//     const passedOrderBy = req.query.orderBy as string
//     const passedNumOfResults = req.query.numOfResults as string
//     const numOfResultsAsNum = Number(passedNumOfResults)

//     const resObj = {
//         success: true,
//         data: {
//             region: passedRegion,
//             numOfResults: passedNumOfResults,
//             orderBy: passedOrderBy,
//             outcodeResults: [
//                 {
//                     outcode: 'OC1',
//                     avgPrice: 281000.5,
//                     avgRent: 1000.0,
//                     avgYield: 5.1,
//                     oneYrGrowth: -1.1,
//                     threeYrGrowth: 3.3,
//                     fiveYrGrowth: 5.4
//                 },
//                 {
//                     outcode: 'OC2',
//                     avgPrice: 310200.7,
//                     avgRent: 800.0,
//                     avgYield: 4.6,
//                     oneYrGrowth: -1.6,
//                     threeYrGrowth: 3.7,
//                     fiveYrGrowth: 5.4
//                 },
//                 {
//                     outcode: 'OC3',
//                     avgPrice: 280000.5,
//                     avgRent: 800.0,
//                     avgYield: 2.3,
//                     oneYrGrowth: -1.9,
//                     threeYrGrowth: 3.6,
//                     fiveYrGrowth: 5.2
//                 },
//                 {
//                     outcode: 'OC4',
//                     avgPrice: 345000.0,
//                     avgRent: 800.0,
//                     avgYield: 2.3,
//                     oneYrGrowth: -2.0,
//                     threeYrGrowth: 2.5,
//                     fiveYrGrowth: 3.6
//                 },
//                 {
//                     outcode: 'OC5',
//                     avgPrice: 400000.0,
//                     avgRent: 1300.0,
//                     avgYield: 2.3,
//                     oneYrGrowth: -1.0,
//                     threeYrGrowth: 3.1,
//                     fiveYrGrowth: 5.6
//                 }
//             ],
//         }
//     }
//     res.json(resObj)
// })


// elasticsearchService.get('/search-by-outcode-stub', async (req, res) => {
//     const passedOutcode = req.query.outcode as string
//     const resObj = {
//         success: true,
//         data: {
//             outcode: passedOutcode,
//             avgPrice: 280000,
//             avgRent: 800,
//             avgYield: 2.3,
//             oneYrGrowth: -1,
//             threeYrGrowth: 3,
//             fiveYrGrowth: 5
//         }
//     }
//     res.json(resObj)
// })
