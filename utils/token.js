const jsonWebToken = require('jsonwebtoken')

exports.generateToken = (payload) => {
    return jsonWebToken.sign({ userId: payload }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE_TIME })
}