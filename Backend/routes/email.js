// routes/emailRoutes.js
const express = require('express');
const emailController = require('../controllers/emailController');
const router = express.Router();

router.post('/send', emailController.sendFormDetails);

router.post('/appointment', emailController.bookAppointment);

module.exports = router;
