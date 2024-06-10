const createQuestion = require('../controllers/QuestionController').createQuestion;
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/createQuestion', auth, isAdmin, createQuestion);

module.exports = router;