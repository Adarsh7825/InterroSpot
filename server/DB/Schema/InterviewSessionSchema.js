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
            type: String,
            enum: ['strong_yes', 'strong_no', 'ok', 'good'],
        },
        notes: String, // Additional notes by the interviewer
    }],
    overallFeedback: String, // Summary of the interview
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);