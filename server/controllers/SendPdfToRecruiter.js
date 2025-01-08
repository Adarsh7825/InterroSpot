const express = require('express');
const multer = require('multer');
const path = require('path');
const mailSender = require('../utils/mailSenderWithAttachment');
const Room = require('../DB/Schema/room');
const upload = multer({ dest: 'uploads/' });

exports.sendPdfviaMail = async (req, res) => {
    try {
        const { roomid, formData } = req.body;
        const pdfPath = req.file;
        console.log('PDF path:', req.body);

        // Fetch the recruiter's email based on the room ID
        const room = await Room.findOne({ roomid }).populate('recruiter');
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        const recruiterEmail = room.recruiter.email;

        // Send the email with the PDF attachment
        const subject = 'Interview Feedback PDF';
        const body = 'Please find attached the interview feedback PDF.';
        await mailSender(recruiterEmail, subject, body, pdfPath);

        res.status(200).json({ success: true, message: 'PDF sent successfully' });
    } catch (error) {
        console.error('Error sending PDF:', error);
        res.status(500).json({ success: false, message: 'Failed to send PDF' });
    }
}