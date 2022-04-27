const vendorRepo = require('../repository/vendorRepository').vendorRepository;
const { ValidationError } = require('../exception/error');
const { v4: uuidv4 } = require('uuid');

exports.vendorService = {
    createVendor: async function(input) {

        const { id, name, phone } = input;

        if (name == null || phone == null) {
            throw new ValidationError('Name and Phone are required for Vendor');
        }

        const vendor = id == null ? {...input, id: uuidv4() } : input;

        return await vendorRepo.create(vendor);
    },

    getVendor: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await vendorRepo.getOne(id);
    }
}