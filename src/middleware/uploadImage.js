const multer = require("multer");
require("dotenv").config();
const path = require("path");
const fs = require("fs-extra");
const { SERVERERROR, FAILURE, APP_URL } = require("../../config/key");
const responseHelper = require("../helpers/responseHelper");

var filePath = path.join(__dirname, "../../public/uploads/file");


let fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        
       
        filePath = path.join(__dirname, "../../public/uploads/");
        
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true }, (err) => {});
        }
        cb(null, filePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});


module.exports.uploadFile = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1024 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(xml)$/)) {
            return cb(new Error("Upload proper file!"), false);
        }

        cb(undefined, true);
    },
});