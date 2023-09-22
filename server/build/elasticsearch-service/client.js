"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const initializeElasticSearchClient = () => {
    var _a, _b, _c, _d;
    if (((_a = process.env.ENV) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'DEV') {
        // Initialise connection to local elasticsearch connection
        return new elasticsearch_1.Client({
            node: 'http://localhost:5601'
        });
    }
    else {
        // Initialise connection to cloud deployment
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
const elasticClient = initializeElasticSearchClient();
elasticClient.ping()
    .then(() => console.log(`Elasticsearch client is successfully connected!`))
    .catch(error => console.error("Elasticsearch client is not connected.", error));
exports.default = elasticClient;
