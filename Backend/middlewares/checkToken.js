const { getSecret } = require('../utils/commonUtils');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler')
const BaseError = require('../utils/baseError');
const SessionModel = require('../models/sessionModel');

const checkToken = asyncHandler(async (req, res, next) => {
    // let roleInfo = req.role;
    // if (!roleInfo) {
    //     next();
    //     return;
    // }
    if (!req.headers['authorization'] || (req.headers['authorization']).indexOf('Bearer ') === -1) {
        throw new BaseError(0, 'Unauthorized request', 401);
    }

    let token = (req.headers['authorization']).split(' ')[1] 

    if (!token) {
        throw new BaseError(0, "Token passed should be in valid format", 400);
    }
    // let getUserSessionToken = await SessionModel.findOne({ sessionToken: token, active: true });
    // if (!getUserSessionToken) {
    //     throw new BaseError(0, "Invalid session", 401);
    // }
    let secret = await getSecret();
    if (!secret) {
        throw new BaseError(0, "Invalid secret key", 401);
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            throw new BaseError(0, 'Invalid Token', 401);
        }
        req.user = decoded;
        next();
    });
});

module.exports = checkToken;