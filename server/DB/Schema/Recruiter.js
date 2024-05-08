const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
    company: {
        type: String,
        required: true,
    },
    jobPositions: [{
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['frontend', 'backend', 'devops', 'desktop_engineer', 'react_developer'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requiredSkills: [String],
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