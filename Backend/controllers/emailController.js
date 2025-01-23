const asyncHandler = require('../utils/asyncHandler');
const BaseError = require('../utils/baseError');
const { response, sendEmail } = require('../utils/commonUtils');

const sendFormDetails = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email ||  !phone || !message) {
        throw new BaseError(0, 'Missing required fields: name, email, or message', 400);
    }

    await sendEmail({
        to: process.env.EMAIL_ADMIN,
        subject: 'New Form Submission',
        // text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    response(res, 1, 200, 'Form has been submitted successfully');
});

const bookAppointment = asyncHandler(async (req, res) => {
    const { name, email, phone, date, time, message } = req.body;

    if (!name || !email ||  !phone || !message) {
        throw new BaseError(0, 'Missing required fields: name, email, or message', 400);
    }

    if (!date || !time) {
        throw new BaseError(0, 'Date and time are required for booking', 400);
    }

    const emailContent = `
        <h3>New Appointment Booking</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Message:</strong> ${message}</p>
    `;

    await sendEmail({
        to: process.env.EMAIL_ADMIN,
        subject: 'New Appointment Booking',
        html: emailContent,
    });

    response(res, 1, 200, 'Your appointment request has been successfully submitted');
});

module.exports = {
    sendFormDetails,
    bookAppointment
};
