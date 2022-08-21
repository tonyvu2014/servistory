const workApprovalTemplateRepo = require('../repository/workApprovalTemplateRepository').workApprovalTemplateRepository;
const { ValidationError } = require('../exception/error');

exports.workApprovalTemplateService = {
    getWorkApprovalTemplate: async function(id) {
        if (id == null) {
            throw new ValidationError('Id is required');
        }

        return await workApprovalTemplateRepo.getOne(id);
    },

    getWorkApprovalTemplates: async function(filter, limit, token) {
        return await workApprovalTemplateRepo.getPaginatedList(filter, limit, token);
    }
};