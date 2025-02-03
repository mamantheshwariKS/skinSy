const BaseError = require('../utils/baseError');

const isAdmin = (role = 'admin') => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            throw new BaseError(0, 'Access denied, Only admin can acess this API', 403);
        }
        next();
    };
};

module.exports = isAdmin;
