const { check } = require('express-validator');
const { validationMiddleware } = require('../middlewares/validationMiddleware')

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validationMiddleware,
];

exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand required')
        .isLength({ min: 3 })
        .withMessage('Too short Brand name')
        .isLength({ max: 32 })
        .withMessage('Too long Brand name'),
    validationMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validationMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validationMiddleware,
];