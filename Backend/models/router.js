const express = require('express');
const initRouter = express();

// //Roles Routes
// const rolesRoute = require('./routes/roles');
// initRouter.use('/roles', rolesRoute);
// //Users Route

const usersRoute = require('../routes/users')
initRouter.use('/users', usersRoute)


module.exports = initRouter;