const Users = require('../models/usersModel');
const asyncHandler = require('../utils/asyncHandler')
const BaseError = require('../utils/baseError');
const { response, generateUniqueId, hashPassword, verifyPassword, generateJWT, sendEmail, generateOTP } = require('../utils/commonUtils');

const createUser = asyncHandler(async (req, res) => {

    if ((['firstName', 'lastName', 'phoneNo', 'password'].filter(prop => !req.body[prop])).length > 0) {
        throw new BaseError(0, "Provide valid details to create new user", 400);
    }
    const emailId = req.body.emailId;
    if (!emailId) {
        throw new BaseError(0, 'Provide a valid Email Id', 400);
    }
    let checkUserEmail = (await Users.findOne({ emailId: req.body.emailId }))?.emailId ?? null;
    if (checkUserEmail) {
        throw new BaseError(0, "Email already exists", 400);
    }
    // const userRoleId = req.body.userRoleId;
    // if (!userRoleId) {
    //     throw new BaseError(0, 'Provide a valid Role Id to create new User', 400);
    // }
    // const userRoleInfo = await Roles.findById(userRoleId).select('_id');
    // if (!userRoleInfo || !userRoleInfo._id) {
    //     throw new BaseError(0, 'A valid Role Id is required to create a new user', 400);
    // }
    let hashedPassword = await hashPassword(req.body.password);
    const user = new Users(
        {
            userId: `SH-U${generateUniqueId()}`,
            firstName: (req.body.firstName) ? req.body.firstName : '',
            lastName: (req.body.lastName) ? req.body.lastName : '',
            emailId,
            password: hashedPassword,
            phoneNo: (req.body.phoneNo) ? req.body.phoneNo : '',
        }
    )
    let newUser = await user.save();

    response(res, 1, 201, "User created  successfully", newUser);

});


const userLogin = asyncHandler(async (req, res) => {

    const emailId = req.body.emailId;
    const password = req.body.password;
    const user = await Users.findOne({ emailId: emailId, active: true }).select('emailId password firstName lastName role').lean();
    if (!user) {
        throw new BaseError(0, "Invalid Email or User ID", 400);
    }
    const hashedPassword = user.password;
    const pswdVerificationStatus = await verifyPassword(password, hashedPassword);
    if (!pswdVerificationStatus) {
        throw new BaseError(0, "Invalid Password", 400);
    }
    const payload = {
        role: user.role,
        id: user._id
    };

    const token = await generateJWT(payload, '1h');

    response(res, 1, 200, "Logged in successfully!", {
        ...user,
        password: null,
        token
    });
});


const forgotPassword = asyncHandler(async (req, res) => {
    const { emailId } = req.body;

    const userInfo = await Users.findOne({ emailId });
    if (!userInfo) {
        throw new BaseError(0, "Invalid email", 400);
    }

    const { otp, otpExpiry } = generateOTP();

    userInfo.resetPasswordOTP = otp;
    userInfo.resetPasswordExpiry = otpExpiry;
    await userInfo.save();

    await sendEmail({
        to: emailId,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for resetting your password is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    response(res, 1, 200, "OTP sent to your email.", null);
});


const verifyOTP = asyncHandler(async (req, res) => {
    const { emailId, otp } = req.body;

    const user = await Users.findOne({ emailId });
    if (!user) {
        throw new BaseError(0, "Invalid email", 400);
    }

    if (user.resetPasswordOTP !== otp || user.resetPasswordExpiry < new Date()) {
        throw new BaseError(0, "Invalid or expired OTP", 400);
    }

    user.otpVerified = true;
    await user.save();

    response(res, 1, 200, "OTP verified successfully.", null);
});


const resendOTP = asyncHandler(async (req, res) => {
    const { emailId } = req.body;

    const user = await Users.findOne({ emailId });
    if (!user) {
        throw new BaseError(0, "Invalid email", 400);
    }

    const { otp, otpExpiry } = generateOTP();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpiry = otpExpiry;
    user.otpVerified = false; 

    await user.save();

    await sendEmail({
        to: emailId,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for resetting your password is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    response(res, 1, 200, "OTP has been resent successfully.", null);
});


const resetPassword = asyncHandler(async (req, res) => {
    const { emailId, newPassword } = req.body;

    const user = await Users.findOne({ emailId });
    if (!user) {
        throw new BaseError(0, "Invalid email", 400);
    }

    if (!user.otpVerified) {
        throw new BaseError(0, "OTP not verified", 400);
    }

    user.password = await hashPassword(newPassword);

    user.resetPasswordOTP = null;
    user.resetPasswordExpiry = null;
    user.otpVerified = false; 

    await user.save();

    response(res, 1, 200, "Password has been reset successfully.", null);
});


const fetchAllUsers = asyncHandler(async (req, res) => {

    const users = await Users.find({role: 'user', active: true}); 
    
    response(res, 1, 200, "Users retrieved successfully", users);
});


const fetchSingleUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; 

    const user = await Users.findOne({ _id: userId, active: true }); 
    if (!user) {
        throw new BaseError(0, "User not found", 404);
    }

    response(res, 1, 200, "User fetched successfully", user);
});


const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; 
    const { firstName, lastName, phoneNo, emailId, newPassword, designation } = req.body;

    const user = await Users.findOne({ _id: userId, active: true });
    if (!user) {
        throw new BaseError(0, "User not found", 404);
    }

    if (emailId && emailId !== user.emailId) {
        const emailExists = await Users.findOne({ emailId });
        if (emailExists) {
            throw new BaseError(0, "Email already exists", 400);
        }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNo) user.phoneNo = phoneNo;
    if (emailId) user.emailId = emailId;
    if (designation) user.designation = designation;
    if (newPassword) user.password = await hashPassword(newPassword);

    await user.save();

    response(res, 1, 200, "User updated successfully", user);
});


const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; 

    const user = await Users.findOneAndUpdate(
        { _id: userId },
        { active: false },
        { new: false });

    if (!user) {
        throw new BaseError(0, "User not found", 404);
    }

    response(res, 1, 200, "User deleted successfully", null);
});

const getAllAgents = async (req, res, next) => {
    try {
        const agents = await Users.find({ role: 'agent', active: true }); 
        res.status(200).json({ success: true, data: agents });
    } catch (error) {
        next(error); 
    }
};

module.exports = {
    createUser,
    userLogin,
    fetchSingleUser,
    forgotPassword,
    resetPassword,
    fetchAllUsers,
    updateUser,
    deleteUser,
    verifyOTP,
    resendOTP,
    getAllAgents
}