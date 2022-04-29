const workRequestRepo = require('../repository/workRequestRepository').workRequestRepository;
const { ValidationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');

exports.workRequestService = {
    createWorkRequest: async function(input) {

        const { id, work_id, title } = input;

        if (work_id == null || title == null) {
            throw new ValidationError('Work and title are required');
        }

        const request = id == null ? {...input, id: uuidv4() } : input;

        return await workRequestRepo.create(request);
    },

    updateWorkRequest: async function(input) {
        const { id } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRequestRepo.update(input);
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