const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questions: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
        response: String, // Candidate's response
        feedback: {
            type: Number,
            min: 1,
            max: 10,
        },
        notes: String, // Additional notes by the interviewer
    }],
    overallFeedback: String, // Summary of the interview
    createdAt: {
        type: Date,
        default: Date.now,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
});


module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);