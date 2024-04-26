const mongoose = require("mongoose");
const mailSender = require("../../utils/mailSender");
const emailTemplate = require("../../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    }
});

async function sendverification(email, otp) {
    try {
        const mailResponse = await mailSender(email, "OTP for Verification", emailTemplate(otp));
        console.log("Email sent Successfully : ", mailResponse?.response);
        console.log("mail response 2 ", mailResponse);
    } catch (error) {
        console.log('error in sendOTP', error);
        throw error;
    }
};

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;