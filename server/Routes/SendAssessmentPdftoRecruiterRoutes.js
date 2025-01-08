const express = require('express');
const { sendPdfviaMail } = require('../controllers/SendPdfToRecruiter');
const sendPdf = express.Router();
const { auth } = require('../middleware/auth');

sendPdf.post('/send-pdf', sendPdfviaMail);

module.exports = sendPdf;