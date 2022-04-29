const { vendorService } = require('./service/vendorService');
const { workService } = require('./service/workService');
const { workRequestService } = require('./service/workRequestService');

const resolvers = {
    Mutation: {
        createWork: (event) => {
            return createWork(event);
        },

        updateWork: (event) => {
            return updateWork(event);
        },

        deleteWork: (event) => {
            return deleteWork(event);
        },

        createWorkRequest: (event) => {
            return createWorkRequest(event);
        },

        updateWorkRequest: (event) => {
            return updateWorkRequest(event);
        },

        deleteWorkRequest: (event) => {
            return deleteWorkRequest(event);
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

        getWorkRequest: (event) => {
            return getWorkRequest(event);
        },

        listWorkRequests: (event) => {
            return getWorkRequests(event);
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

async function deleteWork(event) {
    const { input } = event.arguments;
    const { id } = input;

    return await workService.deleteWork(id);
}

// WorkRequest
async function createWorkRequest(event) {
    const { input } = event.arguments; 

    return await workRequestService.createWorkRequest(input);
}

async function updateWorkRequest(event) {
    const { input } = event.arguments; 

    return await workRequestService.updateWorkRequest(input);
}

async function getWorkRequest(event) {
    const { id } = event.arguments;

    return await workRequestService.getWorkRequest(id);
}

async function getWorkRequests(event) {
    const { filter, limit, token } = event.arguments;

    return await workRequestService.getWorkRequests(filter, limit, token);
}

async function deleteWorkRequest(event) {
    const { input } = event.arguments;
    const { id } = input;

    return await workRequestService.deleteWorkRequest(id);
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