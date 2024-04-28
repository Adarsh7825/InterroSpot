const express = require('express');
const validateCode = require('../middleware/validateCode');
const codeController = require('../controllers/codeController');

const codeRouter = new express.Router();

// Ensure the URL and middleware/controller are correctly referenced
codeRouter.post('/execute-code', validateCode, codeController.execute);

module.exports = codeRouter;