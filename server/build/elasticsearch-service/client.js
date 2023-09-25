"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingElasticSearchClient = exports.createElasticSearchClient = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const createElasticSearchClient = () => {
    var _a, _b, _c, _d;
    if (((_a = process.env.ENV) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'DEV') {
        console.log('Initializing development elasticsearch client..');
        return new elasticsearch_1.Client({
            node: 'http://localhost:5601'
        });
    }
    else {
        console.log('Initializing production elasticsearch client..');
        return new elasticsearch_1.Client({
            cloud: {
                id: (_b = process.env.ELASTICSEARCH_CLOUD_ID) !== null && _b !== void 0 ? _b : ''
            },
            auth: {
                username: (_c = process.env.ELASTICSEARCH_ADMIN_USERNAME) !== null && _c !== void 0 ? _c : '',
                password: (_d = process.env.ELASTICSEARCH_ADMIN_PASSWORD) !== null && _d !== void 0 ? _d : ''
            }
        });
    }
};
exports.createElasticSearchClient = createElasticSearchClient;
const pingElasticSearchClient = async (elasticClient) => {
    await elasticClient.ping()
        .then(() => console.log(`Elasticsearch client is successfully connected!`))
        .catch(err => console.error("Elasticsearch client is not connected.", err));
};
exports.pingElasticSearchClient = pingElasticSearchClient;
const elasticClient = (0, exports.createElasticSearchClient)();
exports.default = elasticClient;
