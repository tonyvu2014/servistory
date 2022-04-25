const { dataApiClient } = require("../db");

exports.vendorRepository = {
    getOne: async function(id) {
        const data =  await dataApiClient.query(`SELECT * FROM Vendor WHERE id =:id`, { id });

        return data?.records.length > 0 ? data?.records[0]: null;
    }
}