const { createQuestion, fetchQuestions } = require('../controllers/QuestionController');
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/getQuestions/:roomid', fetchQuestions)
router.post('/createQuestion', auth, isAdmin, createQuestion);

module.exports = router;