const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    mainCategory: {
        type: String,
        enum: ['frontend', 'backend', 'full_stack', 'other'],
        required: true,
    },
    subCategory: {
        type: String,
        enum: [
            'browser_storage',
            'functionality_correct_solution',
            'performant',
            'pseudo_code',
            'corner_cases',
            'data_structure',
            'html_css_basic',
            'html_css_advanced',
            'html_css_responsive_grid',
            'javascript_fundamentals',
            'asynchronous_programming',
            // Add more subcategories as needed
        ],
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the updatedAt field before saving
QuestionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Question', QuestionSchema);