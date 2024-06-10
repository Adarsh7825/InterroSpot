const express = require('express');
const validateCode = require('../middleware/validateCode');
const { execute } = require('../controllers/codeController');
const { isAdmin, isCandidate, isInterviewer, isRecruiter } = require('../middleware/auth');

const codeRouter = new express.Router();

// Ensure the URL and middleware/controller are correctly referenced
codeRouter.post('/execute-code', validateCode, execute);

module.exports = codeRouter;