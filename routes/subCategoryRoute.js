const express = require('express')
const { createSubCategoryController, getAllSubCategoriesController, getSpecificSubCategoryController, updateSubCategoryController, deleteSubCategoryController, setCategoryIdToBody, createFilterObj } = require('../controllers/subCategoryController')
const { createSubCategoryValidator, getSpecificSubCategoriesValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../validators/subCategoryValidator')
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')

const router = express.Router({ mergeParams: true })


router.route('/')
    .post(authenticatedUser, allowedTo('admin', 'manager'), setCategoryIdToBody, createSubCategoryValidator, createSubCategoryController)
    .get(createFilterObj, getAllSubCategoriesController)
router.route('/:id')
    .get(getSpecificSubCategoriesValidator, getSpecificSubCategoryController)
    .put(authenticatedUser, allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategoryController)
    .delete(authenticatedUser, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategoryController)
module.exports = router