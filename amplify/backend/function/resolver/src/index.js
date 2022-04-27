const { vendorService } = require('./service/vendorService');
const { workService } = require('./service/workService');

const resolvers = {
    Mutation: {
        createWork: (event) => {
            return createWork(event);
        },

        updateWork: (event) => {
            return updateWork(event);
        },

        createVendor: (event) => {
            return createVendor(event);
        }
    },

    Query: {
        getWork: (event) => {
            return getWork(event);
        },

        listWorks: (event) => {
            return getWorks(event);
        },

        getVendor: (event) => {
            return getVendor(event);
        }
    }
}

exports.handler = async (event, context) => {

    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(`CONTEXT: ${JSON.stringify(context)}`);

    const typeHandler = resolvers[event.typeName];
    if (typeHandler) {
      const resolver = typeHandler[event.fieldName];
      if (resolver) {
        return await resolver(event);
      }
    }
    throw new Error("Resolver not found.");
};

// Work
async function createWork(event) {
    const { input } = event.arguments; 

    return await workService.createWork(input);
}

async function updateWork(event) {
    const { input } = event.arguments; 

    return await workService.updateWork(input);
}

async function getWork(event) {
    const { id } = event.arguments;

    return await workService.getWork(id);
}

async function getWorks(event) {
    const { filter, limit, token } = event.arguments;

    return await workService.getWorks(filter, limit, token);
}

// Vendor
async function getVendor(event) {
    const { id } = event.arguments;

    return await vendorService.getVendor(id);
}

async function createVendor(event) {
    const { input } = event.arguments; 

    return await vendorService.createVendor(input);
}