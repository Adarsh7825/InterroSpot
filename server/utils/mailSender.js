const nodemailer = require('nodemailer');

// Function to send a single email
const sendEmail = async (transporter, email, subject, body) => {
    let mailOptions = {
        from: 'InteractIView Interview <your-email@example.com>', // Replace with your actual email
        to: email,
        subject: subject,
        html: body,
    };
    await transporter.sendMail(mailOptions);
};

// Function to handle sending of both single and multiple emails
const mailSender = async (emailData) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // Check if emailData is an array (multiple emails) or not (single email)
    if (Array.isArray(emailData)) {
        // Handle multiple emails
        for (const { email, subject, body } of emailData) {
            try {
                await sendEmail(transporter, email, subject, body);
                console.log(`Email sent successfully to ${email}`);
            } catch (error) {
                console.error(`Failed to send email to ${email}: ${error}`);
            }
        }
    } else {
        // Handle single email
        const { email, subject, body } = emailData; // Assuming emailData is an object for single email
        try {
            await sendEmail(transporter, email, subject, body);
            console.log(`Email sent successfully to ${email}`);
        } catch (error) {
            console.error(`Failed to send email to ${email}: ${error}`);
        }
    }
};

module.exports = mailSender;

