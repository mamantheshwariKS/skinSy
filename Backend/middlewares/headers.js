const setHeaders = (req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', '*');

    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
}

module.exports = setHeaders;