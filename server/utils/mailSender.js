const nodemailer = require("nodemailer");

const mailSender = async (email, subject, body) => {
    try {
        let transporter = nodemailer?.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })


        let info = await transporter?.sendMail({
            from: 'InterroSpot',
            to: `${email}`,
            subject: `${subject}`,
            html: `${body}`,
        })
        console.log(info);
        return info;

    } catch (error) {
        console.log('error in mailSender');
    }
};

module.exports = mailSender;