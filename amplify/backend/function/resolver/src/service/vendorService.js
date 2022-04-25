const vendorRepo = require('../repository/vendorRepository').vendorRepository;
const { ValidationError } = require('../exception/error');

exports.vendorService = {
    getVendor: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await vendorRepo.getOne(id);
    }
}