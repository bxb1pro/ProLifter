const nodemailer = require('nodemailer');

// Transporter with .env variables for security
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send a confirmation email
const sendConfirmationEmail = (userEmail) => {
    const mailOptions = {
        from: 'cwtestdb1@gmail.com',
        to: userEmail,
        subject: 'Welcome to ProLifter!',
        text: 'Thank you for signing up - your weightlifting journey begins here!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = {
    sendConfirmationEmail,
};