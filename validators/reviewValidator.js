const { check, body } = require('express-validator');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const reviewModel = require('../models/reviewModel');

exports.createReviewValidator = [
    check('title').optional(),
    check('ratings')
        .notEmpty()
        .withMessage('ratings value required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 to 5'),
    check('user').isMongoId().withMessage('Invalid Review id format'),
    check('product')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) =>
            // Check if logged user create review before
            reviewModel.findOne({ user: req.user._id, product: req.body.product }).then(
                (review) => {
                    if (review) {
                        return Promise.reject(
                            new Error('You already created a review before')
                        );
                    }
                }
            )
        ),
    validationMiddleware,
];

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validationMiddleware,
];

exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) =>
            // Check review ownership before update
            reviewModel.findById(val).then((review) => {
                if (!review) {
                    return Promise.reject(new Error(`There is no review with id ${val}`));
                }

                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(
                        new Error(`Your are not allowed to perform this action`)
                    );
                }
            })
        ),
    validationMiddleware,
];

exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) => {
            // Check review ownership before update
            if (req.user.role === 'user') {
                return reviewModel.findById(val).then((review) => {
                    if (!review) {
                        return Promise.reject(
                            new Error(`There is no review with id ${val}`)
                        );
                    }
                    if (review.user.toString() !== req.user._id.toString()) {
                        return Promise.reject(
                            new Error(`Your are not allowed to perform this action`)
                        );
                    }
                });
            }
            return true;
        }),
    validationMiddleware,
];