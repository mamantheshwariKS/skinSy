const mongoose = require('mongoose');

const mongoSchema = mongoose.Schema;

const usersSchema = new mongoSchema({

    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    emailId: {
        type: String,
        lowercase: true,
        default: ''
    },
    password: {
        type: String,
        required: [true, 'User\'s password is required'],
        default: ''
    },
    designation: {
        type: String,
    },
    phoneNo: {
        type: String,
        default: ''
    },
    resetPasswordOTP: { 
        type: String, 
        default: null 
    },
    resetPasswordExpiry: { 
        type: Date, 
        default: null 
    },
    otpVerified: { 
        type: Boolean, 
        default: false 
    }, 
    role: {
        type: String,
        enum: ['user', 'admin', 'agent'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Users', usersSchema);