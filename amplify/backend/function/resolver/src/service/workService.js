const workRepo = require('../repository/workRepository').workRepository;
const { ValidationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');

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
        const { id } = input;

        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRepo.update(input);
    },

    getWork: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workRepo.getOne(id);
    },

    getWorks: async function(filter, limit, token) {
        return await workRepo.getPaginatedList(filter, limit, token);
    }
};