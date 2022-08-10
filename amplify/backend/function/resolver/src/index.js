const { vendorService } = require('./service/vendorService');
const { workService } = require('./service/workService');
const { workRequestService } = require('./service/workRequestService');
const { pushSubscriptionService } = require('./service/pushSubscriptionService');
// const webpush = require('web-push');

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
        },

        createPushSubscription: (event) => {
            return createPushSubscription(event);
        },

        updatePushSubscription: (event) => {
            return updatePushSubscription(event);
        },

        deletePushSubscription: (event) => {
            return deletePushSubscription(event);
        },

        notifyWorkStatus: (event) => {
            return notifyWorkStatus(event);
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
            return listWorkRequests(event);
        },

        getVendor: (event) => {
            return getVendor(event);
        },

        getPushSubscription: (event) => {
            return getPushSubscription(event)
        },

        listPushSubscriptions: (event) => {
            return listPushSubscriptions(event)
        }
    },

    Work: {
        requests: (event) => {
            return getWorkRequests(event);
        },

        vendor: (event) => {
            return getWorkVendor(event);
        }
    },

    WorkRequest: {
        work: (event) => {
            return getRequestWork(event);
        }
    }
}

exports.handler = async (event, context) => {

    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(`CONTEXT: ${JSON.stringify(context)}`);

    // if (event.name === 'push') {
    //     const publicVapidKey = process.env.WEB_PUSH_PUBLIC_KEY;
    //     const privateVapidKey = process.env.WEB_PUSH_PRIVATE_KEY;
        
    //     webpush.setVapidDetails('mailto:arland@servistory.com', publicVapidKey, privateVapidKey);

    //     const subscription = '{"endpoint":"https://fcm.googleapis.com/fcm/send/cpxIfR5efgk:APA91bGda8rEOiB81Dk8biFyOeKqLTyz9diBHALmS81hCzciD9W_oCBNwmVazxv3BQePz2bqu03gi_nDtBQ-VBttcYK1aflkWK6AAc51lmd5S-8NfcZJNekBCXHENJ2ZShrm-44Kfr20","expirationTime":null,"keys":{"p256dh":"BDpC963WPzAGU8D_FIq9QbH5QPYh48tobrtBpzO9tgV-YpK7tlgZT58gP0P1PsRNCieuo5OwfnEyQ6ZLOWolehg","auth":"pwNM66WfoQmNIn0w55Fw8A"}}';

    //     const payload = JSON.stringify({
    //         title: 'Servistory',
    //         body: 'You have a new work approval'
    //     });

    //     const result = await webpush.sendNotification(JSON.parse(subscription), payload);
    //     console.log('Send push notification result', result);
    // }

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

async function listWorkRequests(event) {
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

async function getRequestWork(event) {
    const workId = event.source.work_id;

    return await workService.getWork(workId);
}

// Work
async function getWorkRequests(event) {
    const { filter, limit, token } = event.arguments;
    const workId = event.source.id;

    return await workRequestService.getWorkRequests({...filter, work_id: { eq: workId } }, limit, token);
}

async function getWorkVendor(event) {
    const vendorId = event.source.vendor_id;

    return await vendorService.getVendor(vendorId);
}

async function notifyWorkStatus(event) {
    const { input } = event.arguments;
    const workId = input.work_id;

    const count = await workService.notifyWorkStatus(workId);

    return {
        count
    }
}

// Push Subscriptions
async function createPushSubscription(event) {
    const { input } = event.arguments; 

    return await pushSubscriptionService.createPushSubscription(input);
}

async function updatePushSubscription(event) {
    const { input } = event.arguments; 

    return await pushSubscriptionService.updatePushSubscription(input);
}

async function getPushSubscription(event) {
    const { id } = event.arguments;

    return await pushSubscriptionService.getPushSubscription(id);
}

async function listPushSubscriptions(event) {
    const { filter, limit, token } = event.arguments;

    return await pushSubscriptionService.getPushSubscriptions(filter, limit, token);
}

async function deletePushSubscription(event) {
    const { input } = event.arguments;
    const { id } = input;

    return await pushSubscriptionService.deletePushSubscription(id);
}
