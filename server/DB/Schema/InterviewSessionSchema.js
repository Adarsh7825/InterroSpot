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
            type: String,
            enum: ['strong_yes', 'yes', 'ok', 'no', 'strong_no'],
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
        ref: 'room',
        required: true,
    },
    imageUrl: String,
});

// Method to calculate overall feedback
InterviewSessionSchema.methods.calculateOverallFeedback = function () {
    const feedbackCounts = {
        strong_yes: 0,
        yes: 0,
        ok: 0,
        no: 0,
        strong_no: 0,
    };

    this.questions.forEach(question => {
        if (question.feedback) {
            feedbackCounts[question.feedback]++;
        }
    });

    // Example logic to determine overall feedback
    if (feedbackCounts.strong_yes > feedbackCounts.strong_no) {
        this.overallFeedback = 'strong_yes';
    } else if (feedbackCounts.strong_no > feedbackCounts.strong_yes) {
        this.overallFeedback = 'strong_no';
    } else if (feedbackCounts.yes > feedbackCounts.no) {
        this.overallFeedback = 'yes';
    } else if (feedbackCounts.no > feedbackCounts.yes) {
        this.overallFeedback = 'no';
    } else {
        this.overallFeedback = 'ok';
    }

    return this.overallFeedback;
};

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);