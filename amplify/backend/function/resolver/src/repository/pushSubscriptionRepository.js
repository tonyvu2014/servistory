const { dataApiClient } = require("../db");
const { DatabaseError, NotFoundError } = require("../exception/error");
const { parseFilter } = require('../common/conditionParser');
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const constant = require('../common/constant');

exports.pushSubscriptionRepository = {
    create: async function(pushSubscription) {
        const { id, vendor_id, subscription } = pushSubscription;

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);

        const result = await dataApiClient.query(`
            INSERT INTO PushSubscription (id, vendor_id, subscription,  
                date_time_created, date_time_updated) 
            VALUES (:id, :vendor_id, :subscription,
                :date_time_created, :date_time_updated)
        `, { id, vendor_id, subscription, date_time_created: now, date_time_updated: now }
        );

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to create push subscription');
        }

        return await this.getOne(id);
    },

    update: async function(pushSubscription) {

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);

        const { id, date_time_created } = pushSubscription;

        const updateSetStatement = [
            'vendor_id', 'subscription' ,'date_time_created'
        ]
            .filter(field => pushSubscription[field] != null)
            .map(field => `${field} = :${field}`)
            .join(', ');

        const result = await dataApiClient.query(`
            UPDATE PushSubscription SET ${updateSetStatement}, date_time_updated = :date_time_updated
            WHERE id = :id
        `, { 
            id, 
            ...pushSubscription, 
            ...(date_time_created && {date_time_created: format(parseISO(date_time_created), constant.DEFAULT_DB_DATE_FORMAT)}),
            date_time_updated: now 
        });

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to update push subscription');
        }

        return await this.getOne(id);
    },

    getOne: async function(id) {
        const data =  await dataApiClient.query(`SELECT * FROM PushSubscription WHERE id =:id`, { id });

        return data?.records.length > 0 ? data?.records[0]: null;
    },

    getPaginatedList: async function(filter, limit, token) {
        const filterCondition = parseFilter(filter);

        let countSql = 'SELECT COUNT(*) AS total FROM PushSubscription';
        if (filterCondition) {
            countSql = `${countSql} WHERE ${filterCondition}`;
        }

        const result = await dataApiClient.query(countSql);

        const { total } = result.records[0];

        let offset = parseInt(token);

        if (isNaN(offset)) {
            offset = 0
        }

        let sql = 'SELECT * FROM PushSubscription';

        if (filterCondition) {
            sql = `${sql} WHERE ${filterCondition}`
        }

        if (limit) {
            sql = `${sql} ORDER BY date_time_updated DESC, date_time_created DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        console.log('PushSubscription paginatedList Query with filter and limit:', sql);

        const data = await dataApiClient.query(sql);

        const nextIndex = offset + data.records.length;
        const previousIndex = offset - limit;

        return {
            items: data.records,
            total,
            previousToken: previousIndex > 0 ? previousIndex.toString() : null,
            nextToken: nextIndex < total ? nextIndex.toString() : null
        }
    },

    delete: async function(id) {
        const data = await this.getOne(id);

        if (!data) {
            throw new NotFoundError(`Push Subscription is not found for id: ${id}`);
        }

        const result =  await dataApiClient.query(`DELETE FROM PushSubscription WHERE id =:id`, { id });

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to delete push subscription');
        }

        return data;
    }
}