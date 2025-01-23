const { errorLogHandler } = require('./errorLogHandler');
module.exports = async (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    await errorLogHandler(false, null, err, err.message, statusCode, 'API Error', req.originalUrl, req.method, req.body, req.headers);
    res.status(statusCode).json({
        status: err.status,
        message: err.message,
        data: null
    });
};