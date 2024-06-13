const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        immutable: true,
    },
    roomid: {
        type: String,
        required: true,
        trim: true,
        immutable: true
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
        default: 'javascript'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        immutable: true
    },
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    imageUrlforInterviewer: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

roomSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.owner;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
}

// Check if the model already exists before defining it
const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
module.exports = Room;