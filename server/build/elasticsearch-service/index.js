"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const authentication_1 = require("./queries/authentication");
const client_1 = __importStar(require("./client"));
const elasticsearchService = (0, express_1.default)();
const PORT = 8040;
elasticsearchService.use(body_parser_1.default.json());
elasticsearchService.use((0, cors_1.default)());
// check elastic Client is connected
if (client_1.default) {
    (0, client_1.pingElasticSearchClient)(client_1.default);
}
else {
    console.warn('No connection to elasticsearch');
}
// middleware to hahndle api requests when elasticsearch is down
elasticsearchService.use((req, res, next) => {
    if (!client_1.default) {
        const errorMessage = 'Elasticsearch client is not connected.';
        return res.status(500).json({ error: errorMessage });
    }
    next();
});
elasticsearchService.get('/', async (req, res) => {
    res.send('Hello World from elasticsearchService');
});
elasticsearchService.get('/test', async (req, res) => {
    res.json('Successfully pinged elasticsearch node');
});
elasticsearchService.get('/search-by-outcode-stub', async (req, res) => {
    const passedOutcode = req.query.outcoede;
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
    };
    res.json(resObj);
});
elasticsearchService.get('/search-by-region-stub', async (req, res) => {
    const passedRegion = req.query.region;
    const passedOrderBy = req.query.orderBy;
    const passedNumOfResults = req.query.numOfResults;
    const numOfResultsAsNum = Number(passedNumOfResults);
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
    };
    res.json(resObj);
});
elasticsearchService.get('/user-index-exists', async (req, res) => {
    try {
        const usersIndexExists = await (0, authentication_1.checkIndexExists)(client_1.default, 'users');
        console.log(`From index ${usersIndexExists}`);
        res.json(String(usersIndexExists));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
elasticsearchService.get('/getUser', async (req, res) => {
    // todo improve error handling with http responses
    try {
        const username = req.query.username;
        console.log(typeof username);
        console.log(username);
        if (typeof username !== 'undefined') {
            const user = await (0, authentication_1.getUser)(client_1.default, username);
            res.json(user);
        }
    }
    catch (err) {
        console.error(`Issue retrieving user from data store: `, err);
        res.status(500).json({ error: 'An error occurred' });
    }
});
elasticsearchService.listen(PORT, () => {
    console.log(`Elasticsearch service is running on http://localhost:${PORT}`);
});
exports.default = elasticsearchService;
