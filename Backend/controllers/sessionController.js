const Users = require('../models/usersModel');
const nodemailer = require('nodemailer');
const asyncHandler = require('../utils/asyncHandler')
const BaseError = require('../utils/baseError');
const SessionModel = require('../models/sessionModel')
const { response, generateUniqueId, hashPassword, verifyPassword, generateJWT, convertDateTime } = require('../utils/commonUtils');

const userLogin = asyncHandler(async (req, res) => {

    const emailId = req.body.emailId;
    const password = req.body.password;
    const user = await Users.findOne({ emailId: emailId, active: true }).select('emailId password userId  firstName lastName').lean();
    if (!user) {
        throw new BaseError(0, "Invalid Email or User ID", 400);
    }
    const hashedPassword = user.password;
    const pswdVerificationStatus = await verifyPassword(password, hashedPassword);
    if (!pswdVerificationStatus) {
        throw new BaseError(0, "Invalid Password", 400);
    }
    const payload = {
        userName: `${user.firstName} ${user.lastName}`,
        userEmailId: user.emailId,
        // roleId: user.roleId[0],
        userId: user.userId,
        id: user._id
    };

    // const { sessionToken, decodedToken } = await generateJWT(payload, '1h') ?? { sessionToken: '', decodedToken: {} };

    // if (!sessionToken) {
    //     throw new BaseError(0, "Failed to generate session token", 200)
    // }

    // const loggedInUser = await SessionModel.create({
    //     userId: user._id,
    //     sessionToken,
    //     sessionTokenIat: decodedToken?.iat ? new Date(decodedToken.iat * 1000) : null,
    //     sessionTokenExpirationTime: decodedToken?.exp ? new Date(decodedToken.exp * 1000) : null,
    //     email: user.emailId,
    //     active: true,
    //     currentLogin: new Date(),
    // });

    response(res, 1, 200, "Logged in successfully!", {
        ...user,
        password: null,
        sessionToken: "123445"
        // sessionToken: loggedInUser.sessionToken,
        // currentLogin: loggedInUser.currentLogin,
        // lastLogin: loggedInUser.lastLogin ? (loggedInUser.lastLogin) : null
    });
});

const logoutSession = asyncHandler(async (req, res) => {

    let verificationStatus = req.verificationStatus;
    if (!verificationStatus.status) {
        throw new BaseError(0, 'Invalid Token', 401);
    }
    const verifiedSession = verificationStatus.userInfo;
    const loggedInSession = await SessionModel.findOne({ userId: verifiedSession.id, sessionToken: verifiedSession.token, active: true });

    if (!loggedInSession) {
        throw new BaseError(0, 'Failed to logout', 400);
    }
    const currentLogin = loggedInSession.currentLogin;
    const updatedUser = await SessionModel.findOneAndUpdate({ userId: verifiedSession.id, sessionToken: verifiedSession.token, active: true }, { lastLogin: currentLogin, sessionToken: null, currentLogin: null, active: false }, { new: true });
    if (!updatedUser) {
        throw new BaseError(0, 'Failed to logout', 400);
    }
    response(res, 1, 200, "Logged out successfully!", updatedUser);
});

const verifySessionToken = (req, res) => {

    const verificationStatus = req.verificationStatus;
    if (!verificationStatus.status) {
        throw new BaseError(0, 'Invalid Token', 401);
    }

    const userData = verificationStatus.sessionInfo;

    response(res, 1, 200, "Token verified successfully!", userData);
};

module.exports = {
    userLogin,
    logoutSession,
    verifySessionToken
};