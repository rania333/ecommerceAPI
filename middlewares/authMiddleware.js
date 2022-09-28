const { ErrorHandler } = require("../utils/Error")
const jsonWebToken = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const userModel = require('../models/userModel')

exports.authenticatedUser = asyncHandler(async (req, res, nxt) => {
    let authHeader
    // check if token exist
    if (req.headers.authorization) {
        authHeader = req.headers.authorization.split(' ')[1]
    }
    if (!authHeader) {
        nxt(new ErrorHandler('You are not login, Please login to get access this route',
            401))
    }

    // check if token is valid (no changes, no expire)
    const decode = jsonWebToken.verify(authHeader, process.env.SECRET_KEY)
    // check if user exist
    const user = await userModel.findById(decode.userId)
    console.log('tes', user)
    if (!user) {
        nxt(new ErrorHandler('You are not logged in, Please login to get access this', 401))
    }
    // check that password not changed
    if (user.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            user.passwordChangedAt.getTime() / 1000,
            10
        ); //3la 1000 l2n getTime btrg3 timestamps in milliseconds, so we turn to seconds to be same as iat

        // Password changed after token created (Error)
        if (passChangedTimestamp > decode.iat) {
            return nxt(
                new ErrorHandler(
                    'User recently changed his password. please login again..',
                    401
                )
            );
        }
    }

    req.user = user
    nxt()
})
