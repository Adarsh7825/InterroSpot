const Recruiter = require("../DB/Schema/Recruiter");
const mailSender = require("../utils/mailSenderForAllCandidate");
const User = require('../DB/Schema/user'); // Assuming this is your user model
const InterviewSession = require('../DB/Schema/InterviewSessionSchema');

// Create a new recruiter
exports.createInterview = async (req, res) => {
    try {
        const { company, jobPositions, candidates } = req.body;

        const newInterview = new Recruiter({
            company,
            jobPositions,
            candidates,
        });

        const savedInterview = await newInterview.save();

        const jobPositionId = savedInterview.jobPositions[0]._id;
        await exports.createInterviewAndSession(jobPositionId, savedInterview.candidates);

        // Decide where you want to send the final response
        // For now, let's assume we still send it here
        return res.status(200).json({
            success: true,
            message: 'Recruiter created Interview successfully',
            data: savedInterview,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating the interview',
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

function checkAvailabilityOverlap(candidateAvailability, interviewerAvailability) {
    // Simplified logic: returns true if there's any overlap, false otherwise
    // You'll need to replace this with your actual logic
    return true; // Placeholder implementation
}

exports.createInterviewAndSession = async (jobPositionId, candidates) => {
    try {
        console.log(`this is job Position id ${jobPositionId}`);
        console.log(`this is candidate id ${candidates.map(c => c._id)}`);
        console.log(`Candidates: ${JSON.stringify(candidates)}`);
        const recruiter = await Recruiter.findOne({ "jobPositions._id": jobPositionId });
        if (!recruiter) {
            throw new Error('Job position not found');
        }
        const jobPosition = recruiter.jobPositions.find(position => position._id.toString() === jobPositionId.toString());
        if (!jobPosition) {
            throw new Error('Job position not found or invalid jobPositionId');
        }
        let interviewers = await User.find({
            expertiseAreas: { $in: jobPosition.category },
            accountType: 'interviewer',
        });

        // Check if there are enough interviewers
        if (interviewers.length === 0) {
            throw new Error('No interviewers found with the required expertise');
        }

        // Convert interviewers list to a queue for round-robin allocation
        let interviewerQueue = interviewers.slice(); // Clone the array

        for (const candidate of candidates) {
            let sessionCreated = false;
            let attempts = interviewerQueue.length; // Prevent infinite loop

            while (!sessionCreated && attempts > 0) {
                const interviewer = interviewerQueue.shift(); // Get the first interviewer
                if (checkAvailabilityOverlap(candidate.availability, interviewer.availability)) {
                    const session = new InterviewSession({
                        candidate: candidate._id,
                        interviewer: interviewer._id,
                        questions: []
                    });

                    await session.save();
                    console.log(`Interview session created successfully for candidate: ${candidate._id}`);
                    console.log(`Interview session created successfully for interviewer: ${interviewer.email}`);
                    sessionCreated = true;

                    const sessionLink = `http://example.com/session/${session._id}`;

                    await mailSender([
                        {
                            email: candidate.email,
                            subject: "Notification from InterroSpot Regarding Interview Schedule",
                            body: `Your interview is scheduled. Please join using this link: ${sessionLink}`,
                        },
                        {
                            email: interviewer.email,
                            subject: "Notification from InterroSpot Regarding Interview Schedule",
                            body: `You have to take the interview of ${candidate.name}. Please join using this link: ${sessionLink}`,
                        }
                    ]);
                }
                interviewerQueue.push(interviewer); // Place the interviewer at the back of the queue
                attempts--;
            }

            if (!sessionCreated) {
                console.log(`No available interviewer found for candidate: ${candidate._id}`);
            }
        }

        return { success: true, message: 'Interview sessions created successfully for available matches' };
    } catch (error) {
        console.error('Error creating interview sessions:', error);
        return { success: false, message: 'Something went wrong while creating interview sessions', error: error.toString() };
    }
};
// exports.createInterviewAndSession = async (jobPositionId, candidates) => {
//     try {
//         console.log(`this is job Position id ${jobPositionId}`);
//         console.log(`this is candidate id ${candidates.map(c => c._id)}`);
//         console.log(`Candidates: ${JSON.stringify(candidates)}`);
//         const recruiter = await Recruiter.findOne({ "jobPositions._id": jobPositionId });
//         if (!recruiter) {
//             throw new Error('Job position not found');
//         }
//         const jobPosition = recruiter.jobPositions.find(position => position._id.toString() === jobPositionId.toString());
//         if (!jobPosition) {
//             throw new Error('Job position not found or invalid jobPositionId');
//         }
//         const interviewers = await User.find({
//             expertiseAreas: { $in: jobPosition.category },
//             accountType: 'interviewer',
//         });

//         for (const candidate of candidates) {
//             let sessionCreated = false;
//             for (const interviewer of interviewers) {
//                 if (checkAvailabilityOverlap(candidate.availability, interviewer.availability)) {
//                     const session = new InterviewSession({
//                         candidate: candidate._id,
//                         interviewer: interviewer._id,
//                         questions: []
//                     });

//                     await session.save();
//                     console.log(`Interview session created successfully for candidate: ${candidate._id}`);
//                     console.log(`Interview session created successfully for interviewer: ${interviewer.email}`);
//                     sessionCreated = true;

//                     const sessionLink = `http://example.com/session/${session._id}`;

//                     await mailSender([
//                         {
//                             email: candidate.email,
//                             subject: "Notification from InterroSpot Regarding Interview Schedule",
//                             body: `Your interview is scheduled. Please join using this link: ${sessionLink}`,
//                         },
//                         {
//                             email: interviewer.email,
//                             subject: "Notification from InterroSpot Regarding Interview Schedule",
//                             body: `You have to take the interview of ${candidate.name}. Please join using this link: ${sessionLink}`,
//                         }
//                     ]);

//                     break;
//                 }
//             }

//             if (!sessionCreated) {
//                 console.log(`No available interviewer found for candidate: ${candidate._id}`);
//             }
//         }

//         return { success: true, message: 'Interview sessions created successfully for available matches' };
//     } catch (error) {
//         console.error('Error creating interview sessions:', error);
//         return { success: false, message: 'Something went wrong while creating interview sessions', error: error.toString() };
//     }
// };