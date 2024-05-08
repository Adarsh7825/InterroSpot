// recruiter routes
const express = require('express');
const router = express.Router();
const { createInterview, notifyCandidate } = require('../controllers/RecruiterController');
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');
const { createInterviewAndSession } = require('../controllers/InterviewSessionCtrl');

router.post('/create-interview', auth, createInterview);
// router.post('/create-interviewsession', auth, createInterviewAndSession);
router.post('/notify-candidate', auth, notifyCandidate);

module.exports = router;
