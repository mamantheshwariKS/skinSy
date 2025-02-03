const express = require('express')
const initRouter = express();



//Users Route
const usersRoute = require('./routes/users')
initRouter.use('/users', usersRoute)

//Property Route
const propertyRoute = require('./routes/property')
initRouter.use('/properties', propertyRoute)

//Email Route
const emailRoute = require('./routes/email')
initRouter.use('/email', emailRoute)




module.exports = initRouter