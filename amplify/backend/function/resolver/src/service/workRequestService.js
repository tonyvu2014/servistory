const workRequestRepo = require('../repository/workRequestRepository').workRequestRepository;
const workRepo = require('../repository/workRepository').workRepository;
const { ValidationError, NotificationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');
const formatInTimeZone = require('date-fns-tz/formatInTimeZone');
const formatISO = require('date-fns/formatISO');
const addBusinessDays = require('date-fns/addBusinessDays');
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

        const workId = newWorkRequest.work_id;
        const work = await workService.getWork(workId);
        const vendor = await vendorService.getVendor(work.vendor_id);
        
        try {
            await this.notifyCustomer(newWorkRequest, work, vendor);
        } catch (err) {
            throw new NotificationError(`Notification error: ${err}`);
        }

        return newWorkRequest;
    },

    notifyCustomer: async function(workRequest, work, vendor) {
        let message;
        switch (workRequest.status) {
            case 'PENDING': 
                message = `Hi ${work.customer_name}, this is ${vendor?.name}. We’ve identified a recommended maintenance ${workRequest?.title} for your vehicle. ` +
                `You can view and approve it here: ${BASE_URL}/approval/${workRequest.tracking_no}. ` + 
                `If you have any questions, please let us know on ${vendor.contact_no ?? vendor.phone}, thanks!`;
                break;
            case 'APPROVED':
                message = `${work.customer_name}, thanks for viewing and approving "${workRequest.title}". ` +
                `Your estimated vehicle-ready date is ${formatInTimeZone(work.date_time_pickup, vendor.timezone,'dd/MM/yyyy')} at ${formatInTimeZone(work.date_time_pickup, vendor.timezone ,'h:mm a')}. ` +
                'If you have any questions, please let us know.'
                break;
            case 'REJECTED':
                message = `Hi ${work.customer_name}, confirming that you have declined the approval "${workRequest.title}". ` +
                `If you want to discuss it further, please don’t hesitate to give us a buzz on ${vendor.contact_no ?? vendor.phone}`;
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

    notifyVendor: async function(workRequest, work, vendor) {
        let message;
        switch (workRequest.status) {
            case 'APPROVED':
                message = `${work.customer_name} has APPROVED "${workRequest.title}" for "${work.car_model}"`;
                break;
            case 'REJECTED':
                message = `${work.customer_name} has DECLINED "${workRequest.title}" for "${work.car_model}"`;
                break;
            default:         
        }

        if (message) {
            await smsService.sendMessage(
                vendor.phone,
                message,
                vendor.name
            );
        }
    },

    updateWorkRequest: async function(input) {
        const { id, status } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }
        
        let data = input;
        if (status && status === 'APPROVED') {
            const workRequest = await this.getWorkRequest(id);
            const hoursPassed = this.getHoursPassed(workRequest.date_time_created);

            if (hoursPassed > 2) {
                const newCompletionDate = this.getNewExpectedCompletionDate(workRequest.date_time_completed, hoursPassed);
                data = {...data, date_time_completed: newCompletionDate.toISOString()}
            }
        }

        // update date_time_created = datetime when status is updated to PENDING
        if (status && status === 'PENDING') {
            const now = new Date();
            data = {...data, date_time_created: now.toISOString() }
        }

        const updatedWorkRequest = await workRequestRepo.update(data);
        
        if (status && ['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            // update pick-up date to latest work approval's completion date
            if (status === 'APPROVED') {
                await workRepo.update({ id: updatedWorkRequest.work_id, date_time_pickup: formatISO(updatedWorkRequest.date_time_completed) })
            }

            const workId = updatedWorkRequest.work_id;
            const work = await workService.getWork(workId);
            const vendor = await vendorService.getVendor(work.vendor_id);
            
            // send sms notifications to customer
            try {
                await this.notifyCustomer(updatedWorkRequest, work, vendor);
            } catch (err) {
                throw new NotificationError(`Notification error: ${err}`);
            }

            // send sms notifications to mechanics
            if (['APPROVED', 'REJECTED'].includes(status)) {
                try {
                    await this.notifyVendor(updatedWorkRequest, work, vendor);
                } catch (err) {
                    throw new NotificationError(`Notification error: ${err}`)
                }
            }
        }

        return updatedWorkRequest;
    },

    /**
     * Compute the hours which have passed since a moment
     * 
     * @param {Date} date 
     * @returns {Int} - number of hours which has passed since {date}
     */
    getHoursPassed: function(date) {
        const dt = new Date(formatISO(date));
        const now = new Date();

        const timePassed = now - dt;

        const hoursPassed = timePassed / (1000*60*60);

        return hoursPassed;
    },

    /**
     * Compute the new expected completion date based on number of hours 
     * past the current moment. 
     * - Less than 2 hours: no change
     * - More than 2 hours: add 1 day + number of days over 2 hours
     * 
     * @param {Date} expectedCompletionDate 
     * @param {Int} hoursPassed 
     * @returns {Date} newExpectedCompletionDate - newly expected completion date
     */
    getNewExpectedCompletionDate: function(expectedCompletionDate, hoursPassed) {
        if (hoursPassed <= 2) {
            return expectedCompletionDate;
        }

        const currentExpectedCompletionDate = new Date(formatISO(expectedCompletionDate));
        const daysOver = Math.floor((hoursPassed - 2) / 24);
        const newExpectedCompletionDate = addBusinessDays(currentExpectedCompletionDate, 1+daysOver);

        return newExpectedCompletionDate;
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