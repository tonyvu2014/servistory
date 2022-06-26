const { dataApiClient } = require("../db");
const { DatabaseError, NotFoundError } = require("../exception/error");
const { parseFilter } = require('../common/conditionParser');
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const constant = require('../common/constant');
const { nanoid } = require('nanoid')

exports.workRequestRepository = {
    create: async function(request) {
        const { id, work_id, title, description, reason, attachments,
                price, tracking_no, date_time_completed } = request;

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);
        const final_tracking_no = tracking_no ?? nanoid(10);

        const result = await dataApiClient.query(`
            INSERT INTO WorkRequest (id, work_id, title, description, reason, 
                price, date_time_completed, tracking_no, attachments, status, 
                date_time_created, date_time_updated) 
            VALUES (:id, :work_id, :title, :description, :reason, 
                :price, :date_time_completed, :tracking_no, :attachments, :status, 
                :date_time_created, :date_time_updated)
        `, { id, work_id, title, description: description ?? null, reason: reason ?? null,
            price: price ?? null, date_time_completed: date_time_completed ? format(parseISO(date_time_completed), constant.DEFAULT_DB_DATE_FORMAT) : null, 
            tracking_no: final_tracking_no, attachments: attachments ?? null, 
            status: 'PENDING', date_time_created: now, date_time_updated: now }
        );

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to create work');
        }

        return await this.getOne(id);
    },

    update: async function(request) {

        const now = format(new Date(), constant.DEFAULT_DB_DATE_FORMAT);

        const { id, date_time_completed } = request;

        const updateSetStatement = [
            'title', 'description', 
            'price', 'status', 
            'attachments', 'reason',
            'date_time_completed'
        ]
            .filter(field => request[field] != null)
            .map(field => `${field} = :${field}`)
            .join(', ');
        console.log('WorkRequest updateSetStatement', updateSetStatement);

        const result = await dataApiClient.query(`
            UPDATE WorkRequest SET ${updateSetStatement}, date_time_updated = :date_time_updated
            WHERE id = :id
        `, { 
            id, 
            ...request, 
            ...(date_time_completed && {date_time_completed: format(parseISO(date_time_completed), constant.DEFAULT_DB_DATE_FORMAT)}),
            date_time_updated: now 
        });

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to update work request');
        }

        return await this.getOne(id);
    },

    getOne: async function(id) {
        const data =  await dataApiClient.query(`SELECT * FROM WorkRequest WHERE id =:id`, { id });

        return data?.records.length > 0 ? data?.records[0]: null;
    },

    getPaginatedList: async function(filter, limit, token) {
        const filterCondition = parseFilter(filter);

        let countSql = 'SELECT COUNT(*) AS total FROM WorkRequest';
        if (filterCondition) {
            countSql = `${countSql} WHERE ${filterCondition}`;
        }

        console.log('WorkRequest count query:', countSql);

        const result = await dataApiClient.query(countSql);

        const { total } = result.records[0];

        let offset = parseInt(token);

        if (isNaN(offset)) {
            offset = 0
        }

        let sql = 'SELECT * FROM WorkRequest';

        if (filterCondition) {
            sql = `${sql} WHERE ${filterCondition}`
        }

        if (limit) {
            sql = `${sql} ORDER BY date_time_updated DESC, date_time_created DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        console.log('WorkRequest paginatedList Query with filter and limit:', sql);

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
            throw new NotFoundError(`Record is not found for id: ${id}`);
        }

        const result =  await dataApiClient.query(`DELETE FROM WorkRequest WHERE id =:id`, { id });

        if (result?.numberOfRecordsUpdated < 1) {
            throw new DatabaseError('Fail to delete work request');
        }

        return data;
    }
}