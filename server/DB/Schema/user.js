const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error({ error: "Invalid Email address" });
            }
        }
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails: {
        type: String,
        // required: true,
        // ref: "Profile",
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    image: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        default: "candidate",
        enum: ["candidate", "interviewer", "recruiter", "admin",],
    },
    expertiseAreas: [{
        type: String,
    }],
    jobPreferences: [{
        type: String,
    }],
    availability: [{
        day: String,
        start: String,
        end: String,
    }],
    editor: {
        language: {
            type: String,
            default: "javascript",
            trim: true,
        },
        theme: {
            type: String,
            default: "light",
            enum: ["light", "dark"]
        },
        fontSize: {
            type: Number,
            default: 14,
            min: 10,
            max: 20
        },
        keyMap: {
            type: String,
            default: "default",
            enum: ["default", "vim", "emacs", "sublime"]
        },
        fontfamily: {
            type: String,
            default: "monospace",
            enum: ["monospace", "sans-serif", "serif"]
        },
    },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: "Room"
    }]
}, { timestamps: true });

const modelName = 'User';

// Check if the model has already been compiled
module.exports = mongoose.models[modelName]
    ? mongoose.model(modelName)
    : mongoose.model(modelName, UserSchema);