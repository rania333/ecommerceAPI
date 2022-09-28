const slugify = require('slugify')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel');
const { ErrorHandler } = require('../utils/Error');
const { create, getAll, getOne, update } = require('./factoryHandlerController');
const { generateToken } = require('../utils/token');

exports.getUsersController = getAll(userModel)

exports.getUserController = getOne(userModel)

exports.createUserController = create(userModel)

exports.updateUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password, name, ...data } = req.body;
    const slugged = (name) ? slugify(name) : undefined
    const doc = await userModel.findOneAndUpdate(
        { _id: id },
        { ...data, name, slug: slugged },
        { new: true }
    );

    if (!doc) {
        return next(new ErrorHandler(`No user for this id ${id}`, 404));
    }
    res.status(200).json({ data: doc });
});

exports.deactiveUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findOneAndUpdate(
        { _id: id },
        { active: false },
        { new: true });
    if (!user) {
        return next(new ErrorHandler(`No user for this id ${id}`, 404));
    }
    res.status(200).json({ message: 'user account deactiveted successfully' });
});

exports.updatePasswordController = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { password } = req.body

    const user = await userModel.findByIdAndUpdate(id,
        {
            password: await bcrypt.hash(password, 12),
            passwordChangedAt: Date.now()
        }, { new: true })
    if (!user) {
        return next(new ErrorHandler(`No user for this id ${id}`, 404));
    }
    res.status(200).json({ message: 'Your password is updated successfully' });

})

exports.updateLoggedUserPasswordController = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    // 2) Generate token
    const token = generateToken(user._id);
    res.status(200).json({ data: user, token });
});

exports.updateLoggedUserDataController = asyncHandler(async (req, res, next) => {
    const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        { new: true }
    );

    res.status(200).json({ data: updatedUser });
});


exports.deleteLoggedUserDataController = asyncHandler(async (req, res, nxt) => {
    req.params.id = req.user._id
    nxt()
});

exports.getLoggedUserController = asyncHandler(async (req, res, nxt) => {
    req.params.id = req.user._id
    nxt()
})