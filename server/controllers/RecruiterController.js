const Recruiter = require("../DB/Schema/Recruiter");
const mailSender = require("../utils/mailSender");

// Create a new recruiter
exports.createInterview = async (req, res) => {
    try {
        const { company, jobPositions, candidates } = req.body;

        const newInterview = new Recruiter({
            company,
            jobPositions,
            candidates,
        });

        await newInterview.save();

        return res.status(201).json({
            success: true,
            message: 'Recruiter created successfully',
            data: newInterview,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating the recruiter',
        });
    }
};

// Send notification to a candidate
exports.notifyCandidate = async (req, res) => {
    try {
        const { email, message } = req.body;

        await mailSender(email, "Notification from Recruiter", message);

        return res.json({
            success: true,
            message: 'Email sent successfully to candidate',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending email to candidate',
        });
    }
};