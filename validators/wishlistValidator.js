const { check } = require('express-validator');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const productModel = require('../models/productModel');

exports.createWishlistValidator = [
    check('productId')
        .notEmpty()
        .withMessage('productId value required')
        .isMongoId()
        .withMessage('Invalid wishlist id format')
        .custom((val, { req }) =>
            productModel.findById(val).then(
                (prod) => {
                    if (!prod) {
                        return Promise.reject(
                            new Error('This product not exist')
                        );
                    }
                }
            )
        ),
    validationMiddleware,
];

exports.deleteWishlistValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid wishlist id format')
        .custom((val, { req }) => {
            if (req.user.role === 'user') {
                return productModel.findById(val).then((wishlist) => {
                    if (!wishlist) {
                        return Promise.reject(
                            new Error(`There is no wishlist with id ${val}`)
                        );
                    }
                });
            }
            return true;
        }),
    validationMiddleware,
];