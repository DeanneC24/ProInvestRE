import express from 'express'
import bodyParser from 'body-parser';
import getUser from './queries/authentication'
import initializeElasticSearchClient from './client';

const elasticsearchService = express()
const PORT = 8010

const esAdminClient = initializeElasticSearchClient('admin')
const esaPublicClient = initializeElasticSearchClient('public')

elasticsearchService.use(bodyParser.json());

elasticsearchService.get('/', async (req, res)  => {
    res.send('Hello World from elasticsearchService');
  });

elasticsearchService.get('/getUser', async (req, res) => {
    // todo improve error handling with http responses
    try {
        const username: string | undefined  = req.query.username as string | undefined
        if (typeof username !== 'undefined') {
            const user: object = await getUser(esAdminClient, username)
            res.json(user)
        }
    } catch (err) {
        console.error(`Issue retrieving user from data store`)
    }
})

elasticsearchService.listen(PORT, () => {
    console.log(`Elasticsearch service is running on http://localhost:${PORT}`)
})

export default elasticsearchService