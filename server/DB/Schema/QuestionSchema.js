const QuestionSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['frontend', 'backend', 'devops', 'desktop_engineer'],
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    options: [String], // For MCQs
    correctOption: String, // For MCQs
    answer: String, // For open-ended questions
});