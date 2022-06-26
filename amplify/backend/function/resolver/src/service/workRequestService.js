const workRequestRepo = require('../repository/workRequestRepository').workRequestRepository;
const { ValidationError, NotificationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');
const formatInTimeZone = require('date-fns-tz/formatInTimeZone');
const formatISO = require('date-fns/formatISO')
const { smsService } = require('./smsService');
const { workService } = require('./workService');
const { vendorService } = require('./vendorService');
const { BASE_URL } = require('../common/constant');

exports.workRequestService = {
    createWorkRequest: async function(input) {

        const { id, work_id, title } = input;

        if (work_id == null || title == null) {
            throw new ValidationError('Work and title are required');
        }

        const request = id == null ? {...input, id: uuidv4() } : input;

        const newWorkRequest = await workRequestRepo.create(request);

        try {
            await this.notifyCustomer(newWorkRequest);
        } catch (err) {
            throw new NotificationError(`Notification error: ${err}`);
        }

        return newWorkRequest;
    },

    notifyCustomer: async function(workRequest) {
        const workId = workRequest.work_id;

        const work = await workService.getWork(workId);
        const vendor = await vendorService.getVendor(work.vendor_id);

        let message;
        switch (workRequest.status) {
            case 'PENDING': 
                message = `Hi ${work.customer_name}, we’ve identified a recommended maintenance "${workRequest.title}". ` +
                `You can view and approve it here: ${BASE_URL}/approval/${workRequest.tracking_no}.`;
                break;
            case 'APPROVED':
                message = `${work.customer_name}, thanks for viewing and approving "${workRequest.title}". ` +
                `Your estimated vehicle-ready date is ${formatInTimeZone(work.date_time_pickup, vendor.timezone,'dd/MM/yyyy')} at ${formatInTimeZone(work.date_time_pickup, vendor.timezone ,'h:mm a')}. ` +
                'If you have any questions please let us know.'
                break;
            case 'REJECTED':
                message = `Hi ${work.customer_name}, confirming that you have declined the approval "${workRequest.title}". ` +
                `If you want to discuss it further, please don’t hesitate to give us a buzz on ${vendor.phone}.`;
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

    updateWorkRequest: async function(input) {
        const { id, status } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }

        const updatedWorkRequest = await workRequestRepo.update(input);
        
        // send sms notifications to customer
        if (status && ['APPROVED', 'REJECTED'].includes(status)) {
            // update pick-up date to latest work approval's completion date
            if (status === 'APPROVED') {
                await workService.updateWork({ id: updatedWorkRequest.work_id, date_time_pickup: formatISO(updatedWorkRequest.date_time_completed) })
            }
            
            try {
                await this.notifyCustomer(updatedWorkRequest);
            } catch (err) {
                throw new NotificationError(`Notification error: ${err}`);
            }
        }

        return updatedWorkRequest;
    },

    getWorkRequest: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRequestRepo.getOne(id);
    },

    getWorkRequests: async function(filter, limit, token) {
        return await workRequestRepo.getPaginatedList(filter, limit, token);
    },

    deleteWorkRequest: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRequestRepo.delete(id);
    }
};