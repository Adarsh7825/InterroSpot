const nodemailer = require("nodemailer");
const fs = require('fs');

const mailSenderWithAttachment = async (email, subject, body, attachmentPath) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let mailOptions = {
            from: 'InterroSpot',
            to: email,
            subject: subject,
            html: body,
        };

        if (attachmentPath) {
            mailOptions.attachments = [
                {
                    filename: 'interview_feedback.pdf',
                    path: attachmentPath,
                },
            ];
        }

        let info = await transporter.sendMail(mailOptions);
        console.log(info);

        // Delete the temporary PDF file
        if (attachmentPath) {
            fs.unlinkSync(attachmentPath);
        }

        return info;
    } catch (error) {
        console.log('Error in mailSender:', error);
    }
};

module.exports = mailSenderWithAttachment;