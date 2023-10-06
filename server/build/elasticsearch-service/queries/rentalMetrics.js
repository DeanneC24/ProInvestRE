"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByRegion = exports.searchByOutcode = void 0;
const searchByOutcode = async (client, outcode) => {
    try {
        const body = await client.search({
            index: process.env.ELASTICSEARCH_RENTAL_METRIC_INDEX,
            body: {
                query: {
                    match: {
                        outcode: outcode.toLocaleUpperCase()
                    }
                }
            }
        });
        if (body.hits.hits.length === 1) {
            return body.hits.hits[0]._source;
        }
        else if (body.hits.hits.length === 0) {
            console.log(`No results retrieved for ${outcode}`);
            return null;
        }
        else {
            console.error(`Multiple retrieved for outcode ${outcode} found when expecting one`);
            return null;
        }
    }
    catch (err) {
        throw new Error(`Error retrieving data for ${outcode}: ${err}`);
    }
};
exports.searchByOutcode = searchByOutcode;
const searchByRegion = async (client, region, numOfResults, orderBy) => {
    try {
        const body = await client.search({
            index: process.env.ELASTICSEARCH_RENTAL_METRIC_INDEX,
            body: {
                query: {
                    term: {
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
            console.log(`No results retrieved for ${region}`);
            return null;
        }
        else {
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
