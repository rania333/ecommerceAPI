const jsonWebToken = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel');
const { ErrorHandler } = require('../utils/Error');

exports.signupController = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const user = await userModel.create({
        name, email, password
    })
    const token = generateToken(user._id)
    res.status(201).json({ data: user, token });
})

exports.loginController = asyncHandler(async (req, res, nxt) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user || !(await bcrypt.compare(password.toString(), user.password))) {
        return nxt(new ErrorHandler('invalid email or password', 401))
    }
    const token = generateToken(user._id)
    res.status(200).json({ data: user, token });
})



function generateToken(payload) {
    return jsonWebToken.sign({ userId: payload }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE_TIME })
}