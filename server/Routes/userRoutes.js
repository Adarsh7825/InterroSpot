const express = require('express');
const router = express.Router();
const { isAdmin, isCandidate, isInterviewer, isRecruiter, auth } = require('../middleware/auth');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');

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


// reset password
router.post('/reset-password-token', resetPasswordToken)

router.post('/reset-password', resetPassword)

module.exports = router;
