const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobPositionSchema = new Schema({
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
}, { timestamps: true });

module.exports = mongoose.model("JobPosition", JobPositionSchema);