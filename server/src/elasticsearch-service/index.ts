import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { test, getUser, checkIndexExists } from './queries/authentication'
import elasticClient, {pingElasticSearchClient} from './client'

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

// middleware to hahndle api requests when elasticsearch is down
elasticsearchService.use((req, res, next) => {
    if (!elasticClient) {
      const errorMessage = 'Elasticsearch client is not connected.'
      return res.status(500).json({ error: errorMessage });
    }
    next()
  })

elasticsearchService.get('/', async (req, res)  => {
    res.send('Hello World from elasticsearchService')
})

elasticsearchService.get('/test', async (req, res) => {
    res.json('Successfully pinged elasticsearch node')
})

elasticsearchService.get('/search-by-outcode-stub', async (req, res) => {
    const passedOutcode = req.query.outcoede as string
    const resObj = {
        success: true,
        data: {
            outcode: passedOutcode,
            avgPrice: 280000,
            avgRent: 800,
            avgYield: 2.3,
            oneYrGrowth: -1,
            threeYrGrowth: 3,
            fiveYrGrowth: 5
        }
    }
    res.json(resObj)
})


elasticsearchService.get('/search-by-region-stub', async (req, res) => {
    const passedRegion = req.query.region as string
    const passedOrderBy = req.query.orderBy as string
    const passedNumOfResults = req.query.numOfResults as string
    const numOfResultsAsNum = Number(passedNumOfResults)

    const resObj = {
        success: true,
        data: {
            region: passedRegion,
            numOfResults: passedNumOfResults,
            orderBy: passedOrderBy,
            outcodeResults: [
                {
                    outcode: 'OC1',
                    avgPrice: 281000.5,
                    avgRent: 1000.0,
                    avgYield: 5.1,
                    oneYrGrowth: -1.1,
                    threeYrGrowth: 3.3,
                    fiveYrGrowth: 5.4
                },
                {
                    outcode: 'OC2',
                    avgPrice: 310200.7,
                    avgRent: 800.0,
                    avgYield: 4.6,
                    oneYrGrowth: -1.6,
                    threeYrGrowth: 3.7,
                    fiveYrGrowth: 5.4
                },
                {
                    outcode: 'OC3',
                    avgPrice: 280000.5,
                    avgRent: 800.0,
                    avgYield: 2.3,
                    oneYrGrowth: -1.9,
                    threeYrGrowth: 3.6,
                    fiveYrGrowth: 5.2
                },
                {
                    outcode: 'OC4',
                    avgPrice: 345000.0,
                    avgRent: 800.0,
                    avgYield: 2.3,
                    oneYrGrowth: -2.0,
                    threeYrGrowth: 2.5,
                    fiveYrGrowth: 3.6
                },
                {
                    outcode: 'OC5',
                    avgPrice: 400000.0,
                    avgRent: 1300.0,
                    avgYield: 2.3,
                    oneYrGrowth: -1.0,
                    threeYrGrowth: 3.1,
                    fiveYrGrowth: 5.6
                }
            ],
        }
    }
    res.json(resObj)
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