const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const asyncHandler = require('./asyncHandler');
const BaseError = require('./baseError');
// const { add } = require('date-fns');
// const Roles = require('../models/rolesModel')

const response = (res, status, httpStatusCode, message, data) => {
    return res.status(httpStatusCode).json({
        status,
        message,
        data
    });
}


const generateUniqueId = () => {
    let epochSeconds = `${Math.ceil((new Date().getTime()) / 1000)}`;
    return epochSeconds.substr(-5, 5);
};

const getSecret = async () => {
    secret = process.env.JWT_SECRET_TOKEN;
    return secret;
};

const generateJWT = async (payload, expiryTime) => {
        let secret = await getSecret();
        let token =  jwt.sign(payload, secret, { expiresIn: expiryTime });
        return token
};

const hashPassword = async (password) => {
    let hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
    try {
        let verificationStatus = await bcrypt.compare(password, hashedPassword);
        return Promise.resolve(verificationStatus);
    }
    catch (e) {
        return Promise.reject(e)
    }
};

// const convertDateTime = (dateTime) => {
//     const ISTDateTime = dateTime ? add(dateTime, { hours: 5, minutes: 30 }) : null;
//     return ISTDateTime;
// };

const sendEmail = asyncHandler(async ({ to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, 
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Shelterwaves" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        throw new BaseError(0, 'Failed to send email', 500);
    }
});

const caseInsensitive = (value) => new RegExp(value, 'i');

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return { otp, otpExpiry };
}

module.exports = {
    response,
    generateUniqueId,
    getSecret,
    generateJWT,
    hashPassword,
    verifyPassword,
    caseInsensitive,
    sendEmail,
    generateOTP
    // convertDateTime
};