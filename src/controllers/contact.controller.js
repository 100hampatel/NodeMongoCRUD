const responseHelper = require('../helpers/responseHelper');
const logger = require('../helpers/loggerService');
const {
    META_STATUS_0,
    META_STATUS_1,
    SUCCESS,
    FAILURE,
    SERVERERROR,
} = require('../../config/key')
let ObjectId = require('mongodb').ObjectId;
const contactModel = require('../models/contact.model')
const contactValidation = require('../services/validation/contactValidation')
const fs = require("fs-extra");
const xml2js = require('xml2js');
var parser = new xml2js.Parser();

exports.getContacts = async (req, res) => {
    try {
        let reqParam = req.body;
        let blank;
        let search = reqParam.search ? { firstName: new RegExp(reqParam.search, 'i') }:blank;
        let page = reqParam.page || 1;
        let limit = reqParam.limit || 10;

        let skip = (page - 1) * limit;

        let contactData = await contactModel.find(search).sort({ firstName: 1 }).skip(skip).limit(limit);
        let totalCount = await contactModel.countDocuments({ firstName: new RegExp(reqParam.search, 'i') });

        return responseHelper.successapi(res, res.__('getContactSuccessfully'), META_STATUS_1, SUCCESS, contactData,{totalCount:totalCount});
    } catch (e) {
        logger.logger.error(`Error from catch: ${e}`);
        return responseHelper.error(res, res.__('SomethingWentWrongPleaseTryAgain'), SERVERERROR);
    }
};
exports.getContactById = async (req, res) => {
    try {
        let reqParam = req.body;
        console.log('reqParam--',reqParam)
        let validationMessage = await contactValidation.getContactValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);
        let contactData = await contactModel.findOne({ _id: new ObjectId(reqParam.contactId)}).sort({firstName:1});
        console.log('contactData---',contactData)
        if (!contactData ) {
            return responseHelper.successapi(res, res.__("contactNotFound"), META_STATUS_0, SUCCESS);
        }
        return responseHelper.successapi(res, res.__('getContactSuccessfully'), META_STATUS_1, SUCCESS, contactData);
    } catch (e) {
        logger.logger.error(`Error from catch: ${e}`);
        return responseHelper.error(res, res.__('SomethingWentWrongPleaseTryAgain'), SERVERERROR);
    }
}

exports.addContact = async (req, res) => {
    try {
        let reqParam = req.body;
    
        let validationMessage = await contactValidation.addContactValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const contact = new contactModel(req.body);
        await contact.save();

        return responseHelper.successapi(res, res.__('contactAddedSuccefully'), META_STATUS_1, SUCCESS, contact);
    } catch (e) {
        logger.logger.error(`Error from catch: ${e}`);
        return responseHelper.error(res, res.__('SomethingWentWrongPleaseTryAgain'), SERVERERROR);
    }
}
exports.editContact = async (req, res) => {
    try {
        let reqParam = req.body;
    
        let validationMessage = await contactValidation.editContactValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        let contactExist = await contactModel.findOne({ _id: reqParam.contactId })
        if (!contactExist) return responseHelper.successapi(res, res.__('contactNotFound'), META_STATUS_0, SUCCESS)

        contactExist.firstName = reqParam?.firstName ? reqParam.firstName : contactExist.firstName
        contactExist.lastName = reqParam?.lastName ? reqParam.lastName : contactExist.lastName
        contactExist.phone = reqParam?.phone ? reqParam.phone : contactExist.phone
        await contactExist.save();

        return responseHelper.successapi(res, res.__('contactUpdatedSuccefully'), META_STATUS_1, SUCCESS, contactExist);
    } catch (e) {
        logger.logger.error(`Error from catch: ${e}`);
        return responseHelper.error(res, res.__('SomethingWentWrongPleaseTryAgain'), SERVERERROR);
    }
}

exports.deleteContact = async (req, res) => {
    try {
        const reqParam = req.body;
        const validationMessage = await contactValidation.getContactValidation(reqParam);
        if (validationMessage) {
            return responseHelper.error(res, res.__(validationMessage), FAILURE);
        }
        const contact = await contactModel.findByIdAndDelete(reqParam.contactId);
        if (!contact) {
            return responseHelper.successapi(res, res.__("contactNotFound"), META_STATUS_0, SUCCESS);
        }
        return responseHelper.successapi(res, res.__('contactDeletedSuccessfully'), META_STATUS_1, SUCCESS);
    } catch (error) {
        logger.logger.error(`Error deleting contact: ${error}`);
        return responseHelper.error(res, res.__('somethingWentWrong'), SERVERERROR);
    }
};

exports.exportContact = async (req, res) => {
    try {
        const xmlfileName = req.file.filename;
        const filepath = 'public/uploads/' + xmlfileName;

        const data = await fs.promises.readFile(filepath, 'utf8');

        const result = await parser.parseStringPromise(data.replace(/&(?!(?:apos|quot|[gl]t|amp);|#)/g, '&amp;'));

        const contacts = result.contacts.contact.map(contact => ({
            firstName: contact.name ? contact.name[0] : '',
            lastName: contact.lastName ? contact.lastName[0] : '',
            phone: contact.phone ? contact.phone[0] : ''
        }));

        await contactModel.insertMany(contacts);
        return responseHelper.successapi(res, res.__('contactExportSuccefully'), META_STATUS_1, SUCCESS);
    } catch (error) {
        console.error('Error exporting contacts:', error);
        return responseHelper.error(res, res.__('ErrorExportingContacts'), SERVERERROR);
    }
};


