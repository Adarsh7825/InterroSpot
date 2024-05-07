// const InterviewSession = require('../DB/Schema/InterviewSessionSchema');

// exports.createInterviewSession = async (candidateId, interviewerId, questions) => {
//     const session = new InterviewSession({
//         candidate: candidateId,
//         interviewer: interviewerId,
//         questions: questions.map(question => ({
//             question: question.id,
//             response: '',
//             feedback: '',
//             notes: ''
//         })),
//     });

//     try {
//         await session.save();
//         console.log('Interview session created successfully');
//     } catch (error) {
//         console.error('Error creating interview session:', error);
//     }
// }

const Recruiter = require("../DB/Schema/Recruiter");
const InterviewSession = require('../DB/Schema/InterviewSessionSchema');
const User = require('../DB/Schema/user'); // Assuming this is your user model
const mailSender = require("../utils/mailSenderForAllCandidate");

// Utility function for checking availability overlap
// This should be replaced with your actual implementation
function checkAvailabilityOverlap(candidateAvailability, interviewerAvailability) {
    // Simplified logic: returns true if there's any overlap, false otherwise
    // You'll need to replace this with your actual logic
    return true; // Placeholder implementation
}

exports.createInterviewAndSession = async (req, res) => {
    try {
        const { jobPositionId, candidates } = req.body; // Assuming jobPositionId and candidates are provided in the request

        // Fetch the recruiter document that contains the job position
        const recruiter = await Recruiter.findOne({ "jobPositions._id": jobPositionId });
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Job position not found' });
        }

        // Find the specific job position within the recruiter document
        const jobPosition = recruiter.jobPositions.find(position => position._id.toString() === jobPositionId);

        // Fetch interviewers with matching expertise areas
        const interviewers = await User.find({
            expertiseAreas: { $in: jobPosition.expertiseAreas },
            accountType: 'interviewer',
        });

        if (interviewers.length === 0) {
            return res.status(404).json({ success: false, message: 'No interviewers found with the required expertise' });
        }

        // For each candidate, find a matching interviewer and create an interview session
        for (const candidate of candidates) {
            let sessionCreated = false;
            for (const interviewer of interviewers) {
                // Check if the candidate and interviewer availability overlap
                if (checkAvailabilityOverlap(candidate.availability, interviewer.availability)) {
                    // Create an interview session
                    const session = new InterviewSession({
                        candidate: candidate._id,
                        interviewer: interviewer._id,
                        questions: []
                    });

                    await session.save();
                    console.log('Interview session created successfully for candidate:', candidate._id);
                    console.log('Interview session created successfully for interviewer that asign:', interviewer.email);
                    sessionCreated = true;

                    // Send email notifications to both candidate and interviewer
                    const sessionLink = "http://example.com/session/" + session._id; // Example session link, adjust as needed

                    // Send email to candidate
                    const emailData = candidates.map(candidate => ({
                        email: candidate.email, // Assuming each candidate object has an email property
                        subject: "Notification from InterroSpot Regarding Interview Schedule",
                        body: `Your interview is scheduled. Please join using this link: ${sessionLink}`,
                    }));
                    mailSender(emailData)


                    // Send email to interviewer
                    const emailDataforInterviewer = interviewers.map(interviewer => ({
                        email: interviewer.email, // Assuming each interviewer object has an email property
                        subject: "Notification from InterroSpot Regarding Interview Schedule",
                        body: `You have to take the interview of ${candidate.name}. Please join using this link: ${sessionLink}`,
                    }));
                    mailSender(emailDataforInterviewer);

                    break;
                }
            }

            if (!sessionCreated) {
                console.log('No available interviewer found for candidate:', candidate._id);
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Interview sessions created successfully for available matches',
        });
    } catch (error) {
        console.error('Error creating interview sessions:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating interview sessions',
        });
    }
};