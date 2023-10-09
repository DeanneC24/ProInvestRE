"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIndexExists = exports.getUser = void 0;
const checkIndexExists = async (client, indexName) => {
    try {
        const response = await client.indices.exists({ index: indexName });
        console.log(`Index ${indexName} exists? ${response}`);
        return response;
    }
    catch (error) {
        console.error(`Error checking index ${indexName} existence: ${error}`);
        return false;
    }
};
exports.checkIndexExists = checkIndexExists;
const getUser = async (client, username) => {
    try {
        const response = await client.search({
            index: process.env.ELASTICSEARCH_CREDENTIALS_INDEX,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    username: username
                                }
                            }
                        ]
                    }
                }
            }
        });
        const userExists = response.hits.hits.length === 1 ? true : false;
        if (!userExists) {
            console.warn(`User ${username} doesn't exist`);
            return {};
        }
        else {
            console.log(`Successfully retrieved user ${username}`);
            return response.hits.hits[0]['_source'];
        }
    }
    catch (err) {
        console.error(`Issue retrieving user ${username} from data store`);
        throw err;
    }
};
exports.getUser = getUser;
