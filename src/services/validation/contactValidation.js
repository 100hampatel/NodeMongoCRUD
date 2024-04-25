const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const helper = require("../../helpers/Helper");

module.exports = {
    async addContactValidation(req) {
        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required().max(20),
        }).unknown(true);
        const { error } = schema.validate(req);
        if (error) {
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    async editContactValidation(req) {
        const schema = Joi.object({
            contactId:Joi.objectId().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required().max(20),
        }).unknown(true);
        const { error } = schema.validate(req);
        if (error) {
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    async getContactValidation(req) {
        const schema = Joi.object({
            contactId:Joi.objectId().required()
        }).unknown(true);
        const { error } = schema.validate(req);
        if (error) {
            return helper.validationMessageKey("validation", error);
        }
        return null;
    },
    
    
}
