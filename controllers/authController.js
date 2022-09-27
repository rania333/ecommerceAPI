const jsonWebToken = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel');

exports.signupController = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const user = await userModel.create({
        name, email, password
    })
    const token = generateToken(user._id)
    res.status(201).json({ data: user, token });
})


function generateToken(payload) {
    return jsonWebToken.sign({ userId: payload }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE_TIME })
}