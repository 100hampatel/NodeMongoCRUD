const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        index:true
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
}, { collection: "contact", timestamps: true });

module.exports = mongoose.model("contact", ContactSchema);
