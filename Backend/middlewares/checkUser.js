const Users = require('../models/usersModel');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler')
const BaseError = require('../utils/baseError')

const checkUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId || req.body.userId || req.query.userId;
    if (!userId) {
        throw new BaseError(0, 'User Id is required', 400)
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BaseError(0, 'Please enter a valid User Id', 400)
    }
    const user = await Users.findOne({ _id: userId, active: true });
    if (!user) {
        throw new BaseError(0, 'No User was created with this Id', 400)
    }
    req.user = user;
    next();
});

module.exports = checkUser;