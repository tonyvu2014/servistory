const workRepo = require('../repository/workRepository').workRepository;
const { ValidationError, NotificationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');
const formatInTimeZone = require('date-fns-tz/formatInTimeZone');
const { smsService } = require('./smsService');
const { vendorService } = require('./vendorService');

exports.workService = {
    createWork: async function(input) {

        const { 
            id, vendor_id, customer_name, customer_phone, 
            car_model, plate_no
        } = input;

        if (vendor_id == null || customer_name == null || customer_phone == null || car_model == null || plate_no == null) {
            throw new ValidationError('Vendor, Customer and Car Details are required');
        }

        const work = id == null ? {...input, id: uuidv4() } : input;

        const newWork =  await workRepo.create(work);

        try {
            await this.notifyStatusChange(newWork);
        } catch (err) {
            throw new NotificationError(`Notification error: ${err}`);
        }

        return newWork;
    },

    updateWork: async function(input) {
        const { id, status, date_time_pickup } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }

        const updatedWork = await workRepo.update(input);

        // send sms notifications to customer to notify about status change
        if (status && ['PENDING', 'COMPLETED'].includes(status)) {
            try {
                await this.notifyStatusChange(updatedWork);
            } catch (err) {
                throw new NotificationError(`Notification error: ${err}`);
            }
        }

        // send sms notifications to customer to notify about pickup date change
        if (date_time_pickup) {
            try {
                await this.notifyPickupDateChange(updatedWork);
            } catch (err) {
                throw new NotificationError(`Notification error: ${err}`);
            }
        }

        return updatedWork;
    },

    notifyStatusChange: async function(work) {
        const vendorId = work.vendor_id;

        const vendor = await vendorService.getVendor(vendorId);

        let message;
        switch (work.status) {
            case 'PENDING': 
                message = `Hi ${work.customer_name}, thanks for trusting us with your vehicle at ${vendor.name}. ` + 
                `Your vehicle is booked to be in our workshop on the ${formatInTimeZone(work.date_time_arrived, vendor.timezone ,'dd/MM/yyyy')} with a current expected pick-up date of ${formatInTimeZone(work.date_time_pickup, vendor.timezone ,'dd/MM/yyyy')}. ` +
                `We'll keep you updated, and you can also contact us on ${vendor.contact_no ?? vendor.phone}.`;
                break;
            // case 'WORK_COMMENCED':
            //     message = `Hi ${work.customer_name}, good news: we’re beginning work on your vehicle. ` + 
            //     'We’ll let you know in advance if we identify any new items for maintenance. ' +
            //     'Otherwise, we’ll just notify you once your vehicle is ready for collection.'
            //     break;
            case 'COMPLETED':
                message = `Your vehicle is now ready for collection. Thanks for choosing ${vendor.name}. ` +
                `If you have any feedback or questions please let us know and we hope to see you next time ${work.customer_name}!`;
                break;
            default:         
        }

        if (message) {
            await smsService.sendMessage(
                work.customer_phone,
                message,
                work.customer_name
            );
        }
    },

    notifyPickupDateChange: async function(work) {
        const vendorId = work.vendor_id;

        const vendor = await vendorService.getVendor(vendorId);

        const message = `We’ve updated your vehicle ready date to ${formatInTimeZone(work.date_time_pickup, vendor.timezone ,'dd/MM/yyyy')}. ` +
        `If you have any questions please let us know on ${vendor.contact_no ?? vendor.phone}. Thanks ${work.customer_name}.`

        if (message) {
            await smsService.sendMessage(
                work.customer_phone,
                message,
                work.customer_name
            );
        }
    },

    getWork: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRepo.getOne(id);
    },

    getWorks: async function(filter, limit, token) {
        return await workRepo.getPaginatedList(filter, limit, token);
    },

    deleteWork: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRepo.delete(id);
    }
};