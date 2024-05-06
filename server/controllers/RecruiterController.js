const Recruiter = require("../DB/Schema/Recruiter");
const mailSender = require("../utils/mailSenderForAllCandidate");

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
// Send notification to multiple candidates
exports.notifyCandidate = async (req, res) => {
    try {
        const { candidates, message } = req.body; // Assuming candidates is an array and message is the common message to send

        const emailData = candidates.map(candidate => ({
            email: candidate.email, // Assuming each candidate object has an email property
            subject: "Notification from Recruiter",
            body: message,
        }));

        await mailSender(emailData);

        return res.json({
            success: true,
            message: 'Emails sent successfully to candidates',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending emails to candidates',
        });
    }
};