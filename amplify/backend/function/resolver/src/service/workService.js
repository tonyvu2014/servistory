const workRepo = require('../repository/workRepository').workRepository;
const { ValidationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');
const smsService = require('./smService');
const vendorService = require('./vendorService');

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

        return await workRepo.create(work);
    },

    updateWork: async function(input) {
        const { id, status } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }

        // send sms notifications to customer 
        if (status && ['PENDING', 'WORK_COMMENCED', 'COMPLETED'].includes(status)) {
            this.notifyCustomer(id, status);
        }

        return await workRepo.update(input);
    },

    notifyCustomer: async function(id, status) {
        const work = await this.getWork(id);
        const vendorId = work.vendor_id;

        const vendor = await vendorService.getVendor(vendorId);

        let message;
        switch (status) {
            case 'PENDING': 
                message = ```Hi ${work.customer_name}, thanks for trusting us with your vehicle at ${vendor.name}.
                We'll keep you updated, and you can also contact us on ${vendor.phone}
                ```;
                break;
            case 'WORK_COMMENCED':
                message = ```Hi ${work.customer_name},  good news: we’re beginning work on your vehicle. 
                We’ll let you know in advance if we identify any new items for maintenance. 
                Otherwise, we’ll just notify you once your vehicle is ready for collection.```
                break;
            case 'COMPLETED':
                message = ```Your vehicle is now ready for collection. Thanks for choosing ${vendor.name}. 
                If you have any feedback or questions please let us know and we hope to see you next time ${work.customer_name}!
                ```;
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