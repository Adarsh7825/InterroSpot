const Question = require('../DB/Schema/QuestionSchema');
const Room = require('../DB/Schema/room');
const Recruiter = require('../DB/Schema/Recruiter');

exports.createQuestion = async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.fetchQuestions = async (req, res) => {
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

        console.log('Recruiter id :', recruiter.jobPositions[0].category);
        const questions = await Question.find({ mainCategory: recruiter.jobPositions[0].category });
        console.log('Questions:', questions);
        res.status(200).json(questions);
        // Fetch questions based on the recruiter's main category
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ success: false, message: 'Error fetching questions' });
    }
};