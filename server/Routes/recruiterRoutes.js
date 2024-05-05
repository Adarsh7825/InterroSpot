// recruiter routes
const express = require('express');
const router = express.Router();
const { createInterview, notifyCandidate } = require('../controllers/RecruiterController');
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');

router.post('/create-interview', auth, createInterview);
router.post('/notify-candidate', auth, isAdmin, isRecruiter, notifyCandidate);

module.exports = router;
