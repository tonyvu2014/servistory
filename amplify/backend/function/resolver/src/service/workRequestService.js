const workRequestRepo = require('../repository/workRequestRepository').workRequestRepository;
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
                `You can view and approve it here: ${BASE_URL}/approval/${workRequest.tracking_no}`;
                break;
            case 'APPROVED':
                message = `${work.customer_name}, thanks for viewing and approving "${workRequest.title}". ` +
                `Your estimated vehicle-ready date is ${formatInTimeZone(work.date_time_pickup, vendor.timezone,'dd/MM/yyyy')} at ${formatInTimeZone(work.date_time_pickup, vendor.timezone ,'h:mm a')}. ` +
                'If you have any questions please let us know.'
                break;
            case 'REJECTED':
                message = `Hi ${work.customer_name}, confirming that you have declined the approval "${workRequest.title}". ` +
                `If you want to discuss it further, please don’t hesitate to give us a buzz on ${vendor.phone}`;
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
        
        let data = input;
        if (status && status === 'APPROVED') {
            const workRequest = await this.getWorkRequest(id);
            const hoursPassed = this.getHoursPassed(workRequest.date_time_created);

            if (hoursPassed > 2) {
                const newCompletionDate = this.getNewExpectedCompletionDate(workRequest.date_time_completed, hoursPassed);
                data = {...input, date_time_completed: newCompletionDate.toISOString()}
            }
        }

        const updatedWorkRequest = await workRequestRepo.update(data);
        
        // send sms notifications to customer
        if (status && ['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
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

    /**
     * Compute the hours which have passed since a moment
     * 
     * @param {Date} date 
     * @returns {Int} - number of hours which has passed since {date}
     */
    getHoursPassed: function(date) {
        const dt = new Date(formatISO(date));
        console.log('date object', dt);
        const now = new Date();

        const timePassed = now - dt;
        console.log('timePassed', timePassed);

        const hoursPassed = timePassed / (1000*60);

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

        const daysOver = Math.floor(hoursPassed - 2, 24);
        console.log('days over', daysOver);

        const newExpectedCompletionDate = addBusinessDays(currentExpectedCompletionDate, 1+daysOver);
        console.log('newExpectedCompletionDate', newExpectedCompletionDate);

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