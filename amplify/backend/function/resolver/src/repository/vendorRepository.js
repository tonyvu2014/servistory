const { dataApiClient } = require("../db");
const format = require('date-fns/format');
const constant = require('../common/constant');
const { DatabaseError } = require("../exception/error");

exports.vendorRepository = {
    create: async function(vendor) {
        const { id, address, email, name, phone } = vendor;

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);

        const result = await dataApiClient.query(`
            INSERT INTO Vendor (id, address, email, name, phone, date_time_created, date_time_updated) 
            VALUES (:id, :address, :email, :name, :phone, :date_time_created, :date_time_updated)
        `, { id, address: address ?? null, email: email ?? null, name, phone, date_time_created: now, date_time_updated: now }
        );

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to create work');
        }

        return await this.getOne(id);
    },
    getOne: async function(id) {
        const data =  await dataApiClient.query(`SELECT * FROM Vendor WHERE id =:id`, { id });

        return data?.records.length > 0 ? data?.records[0]: null;
    }
}