const { dataApiClient } = require("../db");
const { DatabaseError } = require("../exception/error");
const { parseFilter } = require('../common/conditionParser');
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const constant = require('../common/constant');
const { nanoid } = require('nanoid')

exports.workRepository = {
    create: async function(work) {
        const { id, vendor_id, customer_name, customer_phone, car_model, plate_no, 
            note, date_time_arrived, date_time_pickup } = work;

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);

        const result = await dataApiClient.query(`
            INSERT INTO Work (id, vendor_id, customer_name, customer_phone, car_model, plate_no, note, tracking_no, 
                date_time_arrived, date_time_pickup, status, date_time_created, date_time_updated) 
            VALUES (:id, :vendor_id, :customer_name, :customer_phone, :car_model, :plate_no, :note, :tracking_no,
                :date_time_arrived, :date_time_pickup, :status, :date_time_created, :date_time_updated)
        `, { id, vendor_id, customer_name, customer_phone, car_model, plate_no, note: note ?? null, tracking_no: nanoid(10),
            date_time_arrived: date_time_arrived ? format(parseISO(date_time_arrived), constant.DEFAULT_DB_DATE_FORMAT) : null, 
            date_time_pickup: date_time_pickup ? format(parseISO(date_time_pickup), constant.DEFAULT_DB_DATE_FORMAT) : null, 
            status: 'PENDING', date_time_created: now, date_time_updated: now }
        );

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to create work');
        }

        return await this.getOne(id);
    },

    update: async function(work) {

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);

        const { id, date_time_arrived, date_time_pickup } = work;

        const updateSetStatement = [
            'customer_name', 'customer_phone', 'plate_no', 
            'car_model', 'note', 
            'date_time_arrived', 'date_time_pickup'
        ]
            .filter(field => work[field] != null)
            .map(field => `${field} = :${field}`)
            .join(', ');
        console.log('Work updateSetStatement', updateSetStatement);

        const result = await dataApiClient.query(`
            UPDATE Work SET ${updateSetStatement}, date_time_updated = :date_time_updated
            WHERE id = :id
        `, { 
            id, 
            ...work, 
            ...(date_time_arrived && {date_time_arrived: format(parseISO(date_time_arrived), constant.DEFAULT_DB_DATE_FORMAT)}),
            ...(date_time_pickup && {date_time_pickup: format(parseISO(date_time_pickup), constant.DEFAULT_DB_DATE_FORMAT)}),
            date_time_updated: now 
        });

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to update work');
        }

        return await this.getOne(id);
    },

    getOne: async function(id) {
        const data =  await dataApiClient.query(`SELECT * FROM Work WHERE id =:id`, { id });

        return data?.records.length > 0 ? data?.records[0]: null;
    },

    getPaginatedList: async function(filter, limit, token) {
        const filterCondition = parseFilter(filter);

        let countSql = 'SELECT COUNT(*) AS total FROM Work';
        if (filterCondition) {
            countSql = `${countSql} WHERE ${filterCondition}`;
        }

        console.log('Work count query:', countSql);

        const result = await dataApiClient.query(countSql);

        const { total } = result.records[0];

        let offset = parseInt(token);

        if (isNaN(offset)) {
            offset = 0
        }

        let sql = 'SELECT * FROM Work';

        if (filterCondition) {
            sql = `${sql} WHERE ${filterCondition}`
        }

        if (limit) {
            sql = `${sql} ORDER BY date_time_pickup DESC, date_time_created DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        console.log('Work paginatedList Query with filter and limit:', sql);

        const data = await dataApiClient.query(sql);

        const nextIndex = offset + data.records.length;
        const previousIndex = offset - limit;

        return {
            items: data.records,
            total,
            previousToken: previousIndex > 0 ? previousIndex.toString() : null,
            nextToken: nextIndex < total ? nextIndex.toString() : null
        }
    }
}