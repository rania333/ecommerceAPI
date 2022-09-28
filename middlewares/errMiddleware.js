const { ErrorHandler } = require("../utils/Error")

const ErrorMiddleware = (err, req, res, nxt) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Error'
    if (process.env.NODE_ENV == 'development') {
        sendErrForDev(err, res)
    } else {
        if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if (err.name === 'TokenExpiredError') err = handleJwtExpired();
        sendErrForProd(err, res)
    }

}

const sendErrForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        Error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrForProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}

const handleJwtInvalidSignature = () =>
    new ErrorHandler('Invalid token, please login again..', 401);

const handleJwtExpired = () =>
    new ErrorHandler('Expired token, please login again..', 401);

exports.ErrorMiddleware = ErrorMiddleware