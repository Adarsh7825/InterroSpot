const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
    company: {
        type: String,
        required: true,
    },
    jobPositions: [{
        type: String,
        required: true,
    }],
    candidates: [{
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    }],

}, { timestamps: true });

module.exports = mongoose.model("Recruiter", RecruiterSchema);