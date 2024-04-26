const bcrypt = require('bcrypt');
const User = require('../DB/Schema/User');
const OTP = reuire('../DB/Schema/OTP');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../utils/templates/emailVerificationTemplate');
const { passwordUpdated } = require('../mail/templates/passwordUpdate');
const Profile = require('../DB/Schema/Profile');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists Please signin to COntinue"
            });
        }

        //find the most recent OTP for the email
        const response = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        if (response?.length === 0) {
            return res.status(400).json({
                message: "Please request for OTP"
            });
        } else if (otp !== response[0].otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let approved;
        switch (accountType) {
            case "recruiter":
                approved = true;
                break;
            case "interviewer":
                approved = true;
                break;
            case "candidate":
                approved = true;
                break;
            default:
                approved = false;
        }

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            profile: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(201).json({
            message: "User created successfully",
            user: user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email }).populate("addtionalDetails");

        if (!user) {
            return res.status(401).json({
                message: "User does not exist"
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id, accountType: user.accountType },
                process.env.JWT_SECRET,
                { expiresIn: "21h" }
            );

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 21 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "Login successful",
                token,
                user
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
};


exports.sendotp = async (req, res) => {
    try {
        const { email } = req?.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const existingUser = await User?.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const result = await OTP?.findOne({ otp: otp });
        console.log("Result is Generate OTP Function: ", result);
        console.log("OTP: ", otp);
        console.log("result", result);

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body: ", otpBody);

        try {
            const mailResponse = await mailSender(
                email,
                "Verification Email",
                emailTemplate(otp)
            );
            console.log("Email sent Successfully", mailResponse?.response);
            console.log("mail respose 2 ", mailResponse);
        } catch (error) {
            console.log("Error sending email", error);
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findOne(req.user.id);

        //get old password , new passowrd and confirm passowrd from the request body
        const { oldPassword, newPassword, confirmPassword } = req.body;

        //validate the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, userDetails.password);

        // if the old password is not valid return an error
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }

        // Match the new password and confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }


        // update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true });

        // send email notification
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log("Error occurred whilte updating password", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


