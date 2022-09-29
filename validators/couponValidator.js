const { check } = require('express-validator');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const couponModel = require('../models/couponModel');

exports.getCouponValidator = [
    check('id').isMongoId().withMessage('Invalid coupon id format')
        .custom((val) => {
            couponModel.findById(val).then(coupon => {
                if (!coupon) {
                    return Promise.reject(
                        new Error(`No Coupon for this id: ${categoryId}`)
                    );
                }
            })
            return true
        }),
    validationMiddleware,
];

exports.createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Coupon required')
        .custom((val => {
            couponModel.findOne({ name: val }).then(coupon => {
                if (coupon) {
                    return Promise.reject(new Error(`This coupon already exist`))
                }
            })
            return true
        })),
    check('expire')
        .notEmpty()
        .withMessage('Coupon expiration date required'),
    check('discount')
        .notEmpty()
        .withMessage('Coupon discount required'),
    validationMiddleware,
];

exports.updateCouponValidator = [
    check('id').isMongoId().withMessage('Invalid coupon id format')
        .custom((val => {
            couponModel.findById(val).then(coupon => {
                if (!coupon) {
                    return Promise.reject(new Error(`This coupon doesn't exist`))
                }
            })
            return true
        })),
    check('name')
        .notEmpty()
        .withMessage('Coupon required')
        .custom((val => {
            couponModel.findOne({ name: val }).then(coupon => {
                if (coupon) {
                    return Promise.reject(new Error(`This coupon already exist`))
                }
            })
            return true
        })),
    check('expire')
        .notEmpty()
        .withMessage('Coupon expiration date required'),
    check('discount')
        .notEmpty()
        .withMessage('Coupon discount required'),
    validationMiddleware,
];

exports.deleteCouponValidator = [
    check('id').isMongoId().withMessage('Invalid coupon id format')
        .custom((val => {
            couponModel.findById(val).then(coupon => {
                if (!coupon) {
                    return Promise.reject(new Error(`This coupon doesn't exist`))
                }
            }).catch(err => {
                // return Promise.reject(err)
            })
            return true
        })),
    validationMiddleware,
];