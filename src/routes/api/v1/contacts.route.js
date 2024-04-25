const express = require("express");
const router = express.Router();
const contactController = require("../../../controllers/contact.controller");
const { uploadFile } = require("../../../middleware/uploadImage");

router.post("/add-contact", contactController.addContact);
router.post("/get-contacts", contactController.getContacts);
router.post("/get-contact-by-id", contactController.getContactById);
router.post("/edit-contact", contactController.editContact);
router.post("/delete-contact", contactController.deleteContact);
router.post("/export-contact", uploadFile.single("xmlFile"),contactController.exportContact);
module.exports = router;
