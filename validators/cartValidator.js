const { check } = require('express-validator');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

exports.getCartValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format')
        .custom(val => {
            cartModel.findById(val).then(cart => {
                if (!cart) {
                    return Promise.reject(new Error('This cart not exist'))
                }
            }).catch(err => {

            })
        }),
    validationMiddleware,
];

exports.createCartValidator = [
    check('color')
        .notEmpty().withMessage('color required'),
    check('prdId')
        .notEmpty().withMessage('product required')
        .isMongoId().withMessage('Invalid product id format')
        .custom(async (val) => {
            await productModel.findById(val).then(prd => {
                if (!prd) {
                    return Promise.reject(new Error('This product not exist'))
                }
            }).catch(err => {
            })
        }),
    validationMiddleware
];

exports.updateCartValidator = [
    check('id').
        isMongoId().withMessage('Invalid Cart id format')
        .custom(val => {
            cartModel.findById(val).then(cart => {
                if (!cart) {
                    return Promise.reject(new Error('This cart not exist'))
                }
            }).catch(err => {

            })
            return true
        }),
    validationMiddleware,
];

exports.deleteCartValidator = [
    check('prdId')
        .notEmpty().withMessage('product required')
        .isMongoId().withMessage('Invalid product id format'),
    validationMiddleware,
];