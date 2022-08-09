const pushSubscriptionRepo = require('../repository/pushSubscriptionRepository').pushSubscriptionRepository;
const { ValidationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');
const webpush = require('web-push');

exports.pushSubscriptionService = {
    createPushSubscription: async function(input) {

        const { id, vendor_id, subscription } = input;

        if (vendor_id == null || subscription == null) {
            throw new ValidationError('Vendor and subscription are required');
        }

        const vendorPushSubscriptions = await this.getPushSubscriptions(
            { vendor_id: { eq: vendor_id } }, null, null
        );

        if (vendorPushSubscriptions.total === 0) {
            const pushSubscription = id == null ? {...input, id: uuidv4() } : input;

            const newPushSubscription = await pushSubscriptionRepo.create(pushSubscription);
    
            this.sendNotification(vendor_id, {
                title: 'Servistory',
                body: 'You have subscribed to Servistory push notification'
            });
            return newPushSubscription;
        }

        const existingVendorPushSubscription = vendorPushSubscriptions.items[0];

        return await this.updatePushSubscription({
            id: existingVendorPushSubscription.id,
            subscription
        });
    },

    updatePushSubscription: async function(input) {
        const { id } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }

        const updatedPushSubscription = await pushSubscriptionRepo.update(input);

        return updatedPushSubscription;
    },

    getPushSubscription: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await pushSubscriptionRepo.getOne(id);
    },

    getPushSubscriptions: async function(filter, limit, token) {
        return await pushSubscriptionRepo.getPaginatedList(filter, limit, token);
    },

    deletePushSubscription: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await pushSubscriptionRepo.delete(id);
    },

    sendNotification: async function(vendorId, payload) {
        const vendorPushSubscriptions = await this.getPushSubscriptions(
            { vendor_id: { eq: vendorId } }, null, null
        );

        if (vendorPushSubscriptions.total === 0) {
            return;
        }

        const vendorPushSubscription = vendorPushSubscriptions.items[0];

        const publicVapidKey = process.env.WEB_PUSH_PUBLIC_KEY;
        const privateVapidKey = process.env.WEB_PUSH_PRIVATE_KEY;
        
        webpush.setVapidDetails('mailto:arland@servistory.com', publicVapidKey, privateVapidKey);

        const result = await webpush.sendNotification(JSON.parse(vendorPushSubscription.subscription), payload);
        console.log('Send push notification result', result);
        return result;
    }
};