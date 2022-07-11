function wrapValue(value) {
    if (typeof(value) === 'string') {
        return `"${value}"`
    } 

    return value;
}

function parseCondition(fieldName, operator, value) {
    switch (operator) {
        case 'eq': return `${fieldName} = ${wrapValue(value)}`;
        case 'lt': return `${fieldName} < ${wrapValue(value)}`;
        case 'gt': return `${fieldName} > ${wrapValue(value)}`;
        case 'ne': return `${fieldName} <> ${wrapValue(value)}`;
        case 'ge': return `${fieldName} >= ${wrapValue(value)}`;
        case 'le': return `${fieldName} <= ${wrapValue(value)}`;
        case 'between': return `${fieldName} BETWEEN ${wrapValue(value[0])} AND ${wrapValue(value[1])}`;
        case 'contains': return `UPPER(${fieldName}) LIKE UPPER('%${value}%')`;
        case 'notContains': return `UPPER(${fieldName} NOT LIKE UPPER('%${value}%')`;
        case 'beginsWith': return `UPPER(${fieldName}) LIKE UPPER('${value}%')`;
        default: throw new Error(`Unsupported operator ${operator}`);
    }
}

function parseFilter(filter) {
    let filterCondition = '';

    if (filter == null) {
        return filterCondition;
    }

    let connector;
    let subFilter;
    for (const field of Object.keys(filter)) {
        const condition = filter[field];
        if (['and', 'or', 'not'].includes(field)) {
            connector = field.toUpperCase();
            subFilter = condition;
            continue;
        } 

        const { operator, value } = getConditionOperatorAndValue(condition);
        if (operator == null || value == null) {
            continue;
        }
        filterCondition = `${filterCondition ? filterCondition + ' AND ' : ''}${parseCondition(field, operator, value)}`
    }

    if (connector) {
        if (connector === 'NOT') {
            filterCondition = `${filterCondition} ${connector} ${parseFilter(subFilter)}`;
        } else {
            filterCondition = `${filterCondition} ${connector} (${subFilter.map(function(item) { return parseFilter(item)}).join(' AND ')})`;
        }
    }

    return filterCondition;
}

function getConditionOperatorAndValue(condition) {
    const keys = Object.keys(condition);

    if (!keys.length) {
        return undefined
    }

    const key  = keys[0];

    return { operator: key, value: condition[key], type: typeof(value) }
}

module.exports = {
    parseFilter
}
