// recruiter routes
const express = require('express');
const router = express.Router();
const { createInterview, notifyCandidate, fetchJobPositionFromRecruiter } = require('../controllers/RecruiterController');
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');

router.post('/create-interview', auth, createInterview);
router.post('/notify-candidate', auth, notifyCandidate);
router.get('/getjobposition/:roomid', fetchJobPositionFromRecruiter)

module.exports = router;
