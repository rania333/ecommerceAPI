const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel')

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    // $addToSet => add productId to wishlist array if productId not exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { wishlist: req.body.productId },
        },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Product added successfully to your wishlist.',
        data: user.wishlist,
    });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { wishlist: req.params.productId },
        },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Product removed successfully from your wishlist.',
        data: user.wishlist,
    });
});


exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('wishlist');

    res.status(200).json({
        status: 'success',
        results: user.wishlist.length,
        data: user.wishlist,
    });
});