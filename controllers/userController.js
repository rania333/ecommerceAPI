const slugify = require('slugify')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel');
const { ErrorHandler } = require('../utils/Error');
const { create, getAll, getOne, update } = require('./factoryHandlerController')

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