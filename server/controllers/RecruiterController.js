const Recruiter = require("../DB/Schema/Recruiter");
const mailSender = require("../utils/mailSenderForAllCandidate");
const User = require('../DB/Schema/user');
const InterviewSession = require('../DB/Schema/InterviewSessionSchema');
const Room = require('../DB/Schema/room');
const randomString = require('randomstring');
const baseUrl = process.env.BASE_URL;


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

async function createRoom(roomData, userId, recruiterId) {
    try {
        const room = new Room({
            ...roomData,
            owner: userId,
            recruiter: recruiterId // Add recruiter's _id to the room schema
        });
        await room.save();

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.rooms.push(room._id);
        await user.save();
        return room;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
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

        if (interviewers.length === 0) {
            throw new Error('No interviewers found with the required expertise');
        }

        let interviewerQueue = interviewers.slice(); // Clone the array

        for (const candidate of candidates) {
            let sessionCreated = false;
            let attempts = interviewerQueue.length; // Prevent infinite loop

            while (!sessionCreated && attempts > 0) {
                const interviewer = interviewerQueue.shift(); // Get the first interviewer
                if (checkAvailabilityOverlap(candidate.availability, interviewer.availability)) {
                    // Room creation logic
                    const roomName = `Interview for ${candidate.name}`;
                    const roomid = randomString.generate(6);
                    const language = "javascript";
                    const owner = interviewer._id; // Assuming the interviewer is the room owner
                    const room = { name: roomName, roomid, language, owner };
                    console.log('this sisssss' + recruiter._id);

                    const createdRoom = await createRoom(room, interviewer._id, recruiter._id);
                    const session = new InterviewSession({
                        candidate: candidate._id,
                        interviewer: interviewer._id,
                        questions: [],
                        roomId: createdRoom._id // Use the created room's ID
                    });

                    await session.save();
                    console.log(`Interview session created successfully for candidate: ${candidate._id}`);
                    console.log(`Interview session created successfully for interviewer: ${interviewer.email}`);
                    sessionCreated = true;

                    // Generate the session link using the room's ID
                    const sessionLink = `${baseUrl}/roomdata/${createdRoom.roomid}`;
                    console.log(`${sessionLink}`)
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


exports.fetchJobPositionFromRecruiter = async (req, res) => {
    try {
        const { roomid } = req.params;

        // Find the room by room ID and populate the owner field
        const room = await Room.findOne({ roomid });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        const recruiter = await Recruiter.findById(room.recruiter._id);
        console.log("checking " + recruiter);
        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' });
        }

        const jobPositions = recruiter.jobPositions[0].category;
        res.status(200).json(jobPositions);
        // Fetch questions based on the recruiter's main category
    } catch (error) {
        console.error('Error fetching JobPosition:', error);
        res.status(500).json({ success: false, message: 'Error fetching Jobposition' });
    }
};