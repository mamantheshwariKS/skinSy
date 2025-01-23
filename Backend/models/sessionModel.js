const mongoose = require('mongoose');
require('./usersModel')
const mongoSchema = mongoose.Schema;

const sessionSchema = new mongoSchema({
    userId: {
        type: mongoSchema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required']
    },
    email: {
        type: String,
        required: [true, 'User\'s email id is required'],
        lowercase: true,
    },
    currentLogin: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    sessionToken: {
        type: String
    },
    sessionTokenIat: {
        type: Date
    },
    sessionTokenExpirationTime: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
    deviceName: {
        type: String,
        default: ''
    },
    coordinates: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);