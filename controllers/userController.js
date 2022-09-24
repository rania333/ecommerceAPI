const userModel = require('../models/userModel');
const { ErrorHandler } = require('../utils/Error');
const asyncHandler = require('express-async-handler')
const { create, getAll, getOne, update } = require('./factoryHandlerController')

exports.getUsersController = getAll(userModel)

exports.getUserController = getOne(userModel)

exports.createUserController = create(userModel)

exports.updateUserController = update(userModel)

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
