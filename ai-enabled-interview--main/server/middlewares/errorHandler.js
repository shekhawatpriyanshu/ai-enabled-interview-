const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {

    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });

};