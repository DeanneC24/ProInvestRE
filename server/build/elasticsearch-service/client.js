"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const initializeElasticSearchClient = (userRole) => {
    var _a, _b, _c, _d, _e, _f;
    const cloudId = (_a = process.env.ELASTICSEARCH_CLOUD_ID) !== null && _a !== void 0 ? _a : '';
    let username;
    let password;
    let client;
    // If dev environment, override userRole to 'dev' to use local installation of elasticsearch
    if (((_b = process.env.ENV) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === 'DEV') {
        client = new elasticsearch_1.Client({
            node: 'http://localhost:5601' // Todo: Remove hardcoded
        });
        console.log(`Number of connections: ${client.transport.connectionPool.connections.length}`);
        console.log(`You're connected to the dev elasticsearch cluster at ${client.transport.connectionPool.connections[0].url.href}`);
    }
    else {
        if (userRole === 'admin') {
            username = (_c = process.env.ELASTICSEARCH_ADMIN_USERNAME) !== null && _c !== void 0 ? _c : '',
                password = (_d = process.env.ELASTICSEARCH_ADMIN_PASSWORD) !== null && _d !== void 0 ? _d : '';
        }
        else {
            username = (_e = process.env.ELASTICSEARCH_PUBLIC_USERNAME) !== null && _e !== void 0 ? _e : '';
            password = (_f = process.env.ELASTICSEARCH_PUBLIC_PASSWORD) !== null && _f !== void 0 ? _f : '';
        }
        client = new elasticsearch_1.Client({
            cloud: {
                id: cloudId
            },
            auth: {
                username: username,
                password: password
            }
        });
    }
    client.ping()
        .then(response => console.log(`You are connected to Elasticsearch as ${userRole}!`))
        .catch(error => console.error(`Unable to connect to Elasticsearch ${userRole}.`));
    return client;
};
exports.default = initializeElasticSearchClient;
