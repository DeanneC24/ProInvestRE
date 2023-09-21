"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            return response.hits.hits[0];
        }
    }
    catch (err) {
        console.error(`Issue retrieving user from data store`);
        throw err;
    }
};
// const checkUserExists = async (client: Client, username: string, password: string): Promise<boolean> => {
//     try {
//         const body = await client.search({
//             index: process.env.ELASTICSEARCH_CREDENTIALS_INDEX,
//             body: {
//                 query: {
//                     bool:{
//                     must:[
//                         {
//                             match: {
//                                 username: username
//                             }
//                         },
//                         {
//                             match: {
//                                 password: password
//                             }
//                         },
//                     ]
//                     }
//                 }
//             }}
//             // todo return/ log
//         )
//         const hits = body.hits.hits
//         if (hits.length === 0) {
//             return true
//         } else {
//             return false
//         }
//     } catch(err) {
//         console.error('Error checking user: ', err)
//         throw err
//     }
// }
exports.default = getUser;
