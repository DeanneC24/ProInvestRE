"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByRegion = exports.searchByOutcode = void 0;
const searchByOutcode = async (client, outcode) => {
    try {
        // Elasticsearch query to search rental-metrics documents by outcode
        const body = await client.search({
            index: process.env.ELASTICSEARCH_RENTAL_METRIC_INDEX,
            body: {
                query: {
                    match: {
                        /*
                            Use partial search so that postcode inputs will return
                            results for the corresponding outcode
                        */
                        outcode: outcode.toLocaleUpperCase()
                    }
                }
            }
        });
        // If one result, that is the corresponding document
        if (body.hits.hits.length === 1) {
            return body.hits.hits[0]._source;
        }
        // If no result, no documents for that outcode, log it and return null
        else if (body.hits.hits.length === 0) {
            console.log(`No results retrieved for ${outcode}`);
            return null;
        }
        // Should not be multiple results for any outcode, throw error if this occurs
        else {
            console.error(`Multiple retrieved for outcode ${outcode} found when expecting one`);
            return null;
        }
    }
    catch (err) {
        // If an error occurs during the Elasticsearch query, throw an error
        throw new Error(`Error retrieving data for ${outcode}: ${err}`);
    }
};
exports.searchByOutcode = searchByOutcode;
const searchByRegion = async (client, region, numOfResults, orderBy) => {
    try {
        // Elasticsearch query to search rental-metrics documents by region
        const body = await client.search({
            index: process.env.ELASTICSEARCH_RENTAL_METRIC_INDEX,
            body: {
                query: {
                    term: {
                        /*
                            Use exact search for region as region is a keyword only,
                            partial matches are not helpful in this context.
                        */
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
        });
        if (body.hits.hits.length === 0) {
            // If no result, no documents for that region, log it and return null
            console.log(`No results retrieved for ${region}`);
            return null;
        }
        else {
            // If there are results, map them into OutcodeSearchResults objects and return them in an array
            const results = body.hits.hits.map((item) => ({
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
            }));
            return results;
        }
    }
    catch (err) {
        throw new Error(`Error retrieving data for ${region}: ${err}`);
    }
};
exports.searchByRegion = searchByRegion;
