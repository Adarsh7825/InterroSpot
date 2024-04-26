const express = require('express');
const router = express.Router();
const { isAdmin, isCandidate, isInterviewer, isRecruiter, auth } = require('../middleware/auth');

const {
    login,
    signup,
    changePassword,
    sendotp,
} = require('../controllers/Auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/sendotp', sendotp);
router.post('/change-password', auth, changePassword);


module.exports = router;
