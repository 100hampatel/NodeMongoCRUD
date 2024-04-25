const {
    ACTIVE_STATUS,
    PAGINATION_LIMIT,
    APP_URL,
    DELETED_STATUS,
    SUCCESS,
    META_STATUS_0
} = require("../../config/key");
require("dotenv").config();

const ObjectId = require('mongoose').Types.ObjectId;

//module.exports = otpFunction();
module.exports = {

    toUpperCaseValidation: (str) => {
        if (str.length > 0) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return "";
    },
    validationMessageKey: (apiTag, error) => {
        let key = module.exports.toUpperCaseValidation(
            error.details[0].context.key
        );
        let type = error.details[0].type.split(".");
        type[1] = type[1] === "empty" ? "required" : type[1];
        type = module.exports.toUpperCaseValidation(type[1]);
        key = apiTag + key + type;
        return key;
    },
    isValidObjectId: (data) => {
        if (ObjectId.isValid(data)) {
            if ((String)(new ObjectId(data)) === data)
                return true;
            return false;
        }
        return false;
    },

};
