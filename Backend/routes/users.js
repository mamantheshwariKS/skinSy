const express = require('express');
const router = express.Router();
const { createUser, 
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
 } = require('../controllers/userController');
const {  logoutSession, verifySessionToken } = require('../controllers/sessionController')
// const checkRole = require('../middlewares/checkRole');
const checkToken = require('../middlewares/checkToken')
const isAdmin = require('../middlewares/isAdmin')
// const checkUser = require('../middlewares/checkUser');
// const adminMiddleware = require('../middlewares/role_middlewares/adminMiddleware')

//Create user
router.post('/create', createUser);
//Fetch all Users
router.get('/all', checkToken, isAdmin(), fetchAllUsers);
//Get single user
router.get('/fetchSingleUser/:userId', checkToken, isAdmin(), fetchSingleUser);
// forgot Password
router.post('/forgot/password', forgotPassword);
// Verify OTP
router.post('/verify/otp', verifyOTP);
// Verify OTP
router.post('/resend/otp', resendOTP);
//Reset password
router.post('/reset/password', resetPassword)
//Login user
router.post('/login', userLogin);
//Logout user
// router.post('/logout', checkToken, logoutSession);
//Verify token
// router.post('/verify/token', checkToken, verifySessionToken);
//update user
router.patch('/update/:userId', checkToken, updateUser);
//delete User
router.delete('/delete/:userId', checkToken, isAdmin(), deleteUser)
// get agents
router.get('/agents', checkToken, getAllAgents)

module.exports = router;