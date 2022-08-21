const { dataApiClient } = require("../db");
const { parseFilter } = require('../common/conditionParser');

exports.workApprovalTemplateRepository = {
    getOne: async function(id) {
        const data =  await dataApiClient.query(`SELECT * FROM WorkApprovalTemplate WHERE id =:id`, { id });

        return data?.records.length > 0 ? data?.records[0]: null;
    },

    getPaginatedList: async function(filter, limit, token) {
        const filterCondition = parseFilter(filter);

        let countSql = 'SELECT COUNT(*) AS total FROM WorkApprovalTemplate';
        if (filterCondition) {
            countSql = `${countSql} WHERE ${filterCondition}`;
        }

        const result = await dataApiClient.query(countSql);

        const { total } = result.records[0];

        let offset = parseInt(token);

        if (isNaN(offset)) {
            offset = 0
        }

        let sql = 'SELECT * FROM WorkApprovalTemplate';

        if (filterCondition) {
            sql = `${sql} WHERE ${filterCondition}`
        }

        if (limit) {
            sql = `${sql} ORDER BY date_time_updated DESC, date_time_created DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        console.log('WorkApprovalTemplate paginatedList Query with filter and limit:', sql);

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