const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
    company: {
        type: String,
        required: true,
    },
    jobPositions: [{
        type: Schema.Types.ObjectId,
        ref: 'JobPosition'
    }],
}, { timestamps: true });

module.exports = mongoose.model("Recruiter", RecruiterSchema);