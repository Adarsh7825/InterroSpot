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
        ref: 'room',
        required: true,
    },
    imageUrl: String,
});

// Method to calculate overall feedback
InterviewSessionSchema.methods.calculateOverallFeedback = function () {
    let totalRating = 0;
    let ratedQuestions = 0;

    this.questions.forEach(question => {
        if (question.feedback) {
            totalRating += question.feedback;
            ratedQuestions++;
        }
    });

    const averageRating = totalRating / ratedQuestions;

    // Example logic to determine overall feedback based on average rating
    if (averageRating >= 8) {
        this.overallFeedback = 'strong_yes';
    } else if (averageRating >= 6) {
        this.overallFeedback = 'yes';
    } else if (averageRating >= 4) {
        this.overallFeedback = 'no';
    } else {
        this.overallFeedback = 'strong_no';
    }

    return this.overallFeedback;
};

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);