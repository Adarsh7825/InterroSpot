const express = require('express');
const codeRouter = new express.Router();
const url = require('./../utils/constants/appConstants')
const validateCode = require('./../utils/validators/codeValidator')
const codeController = require('./../')

codeRouter.post(url.CODE.EXECUTE, validateCode, codeController.EXECUTE)