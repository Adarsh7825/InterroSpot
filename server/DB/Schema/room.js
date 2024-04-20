const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    roomid: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    code: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: "plaintext"
    },
}, { timestamps: true });


roomSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.owner;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
}

RoomSchema = mongoose.model("Room", RoomSchema);