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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
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
        autoIndent: {
            type: Boolean,
            default: true,
        },
        formatOnSave: {
            type: Boolean,
            default: true,
        },
        wordwrap: {
            type: Boolean,
            default: true,
        },
        minimap: {
            type: Boolean,
            default: true,
        },
        tabSize: {
            type: Number,
            default: 4,
            min: 2,
            max: 8
        },
        lineNumbers: {
            type: Boolean,
            default: true,
        },
        lineHighlight: {
            type: Boolean,
            default: true,
        },
        lineWrap: {
            type: Boolean,
            default: true,
        },
        autoCloseBrackets: {
            type: Boolean,
            default: true,
        },
        autoCloseTags: {
            type: Boolean,
            default: true,
        },
        autoCloseQuotes: {
            type: Boolean,
            default: true,
        },
        autoCloseBraces: {
            type: Boolean,
            default: true,
        },
        autoCloseParentheses: {
            type: Boolean,
            default: true,
        },
        showFolding: {
            type: Boolean,
            default: true,
        },
        highlightActiveIndentGuide: {
            type: Boolean,
            default: true,
        },
        highlightSelectedWord: {
            type: Boolean,
            default: true,
        },
        highlightLine: {
            type: Boolean,
            default: true,
        },
        highlightGutterLine: {
            type: Boolean,
            default: true,
        },
        highlightBracketPair: {
            type: Boolean,
            default: true,
        },
        highlightTags: {
            type: Boolean,
            default: true,
        },
        highlightModifications: {
            type: Boolean,
            default: true,
        },
        highlightCurrentLine: {
            type: Boolean,
            default: true,
        },
    },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: "room"
    }]
}, { timestamps: true });

// UserSchema.methods.toJSON = function () {
//     let obj = this.toObject();
//     delete obj.createdAt;
//     delete obj.updatedAt;
//     delete obj.__v;
//     if (obj.password) delete obj.password;
//     return obj;
// };

// UserSchema.method.generateAuthToken = async function () {
//     const user = this
//     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 day' })
//     return token
// };

// UserSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({ email })
//     if (!user) throw new Error('Wrong email or password')
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) throw new Error('wrong email or password')
//     return user
// };

// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.password) {
//         if (user.isModified('password')) {
//             user.password = await bcrypt.hash(user.password, 9)
//         }
//     }
//     next()
// })

// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Room.deleteMany({ owner: user._id })
//     next()
// })   

const modelName = 'User';

// Check if the model has already been compiled
module.exports = mongoose.models[modelName]
    ? mongoose.model(modelName)
    : mongoose.model(modelName, UserSchema);