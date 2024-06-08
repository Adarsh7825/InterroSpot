const express = require('express');
const validateCode = require('../middleware/validateCode');
const codeController = require('../controllers/codeController');
const { auth, isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');

const codeRouter = new express.Router();

// Ensure the URL and middleware/controller are correctly referenced
codeRouter.post('/execute-code', auth, validateCode, codeController.execute);

module.exports = codeRouter;