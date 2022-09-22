const { check } = require('express-validator')
const { validationMiddleware } = require('../middlewares/validationMiddleware')

exports.createSubCategoryValidator = [
    check('name').notEmpty().notEmpty()
        .withMessage('SubCategory required')
        .isLength({ min: 2 })
        .withMessage('Too short Subcategory name')
        .isLength({ max: 32 })
        .withMessage('Too long Subcategory name'),
    check('category')
        .notEmpty()
        .withMessage('subCategory must be belong to main category')
        .isMongoId()
        .withMessage('Invalid subCategory id format'),

    validationMiddleware
]

exports.getSpecificSubCategoriesValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validationMiddleware
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validationMiddleware
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validationMiddleware
]