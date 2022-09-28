const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const crypto = require('crypto')
const userModel = require('../models/userModel');
const { ErrorHandler } = require('../utils/Error');
const { generateToken } = require('../utils/token');

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
exports.forgetPasswordController = asyncHandler(async (req, res, nxt) => {
    // 1) Get user by email
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return nxt(
            new ErrorHandler(`There is no user with that email ${req.body.email}`, 404)
        );
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();

    console.log('OPT ', resetCode)
    // 3) Send the reset code via email
    // const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-commerce Team`;
    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: 'Your password reset code (valid for 10 min)',
    //         message,
    //     });
    // } catch (err) {
    //     user.passwordResetCode = undefined;
    //     user.passwordResetExpires = undefined;
    //     user.passwordResetVerified = undefined;

    //     await user.save();
    //     return nxt(new ErrorHandler('There is an error in sending email', 500));
    // }

    res.status(200).json({ status: 'Success', message: 'Reset code sent to email' });
})

exports.verifyResetCodeController = asyncHandler(async (req, res, nxt) => {
    // 1) Get user based on reset code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

    const user = await userModel.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return nxt(new ErrorHandler('Reset code invalid or expired'));
    }

    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: 'Success',
    });
})


exports.resetPasswordController = asyncHandler(async (req, res, nxt) => {
    // 1) Get user based on email
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return nxt(
            new ErrorHandler(`There is no user with email ${req.body.email}`, 404)
        );
    }

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
        return nxt(new ErrorHandler('Reset code not verified', 400));
    }

    user.password = req.body.password;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 3) if everything is ok, generate token
    const token = generateToken(user._id);
    res.status(200).json({ token });
});


