const express = require('express')
const { createSubCategoryController, getAllSubCategoriesController, getSpecificSubCategoryController, updateSubCategoryController, deleteSubCategoryController, setCategoryIdToBody, createFilterObj } = require('../controllers/subCategoryController')
const { createSubCategoryValidator, getSpecificSubCategoriesValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../validators/subCategoryValidator')

const router = express.Router({ mergeParams: true })


router.route('/')
    .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategoryController)
    .get(createFilterObj, getAllSubCategoriesController)
router.route('/:id')
    .get(getSpecificSubCategoriesValidator, getSpecificSubCategoryController)
    .put(updateSubCategoryValidator, updateSubCategoryController)
    .delete(deleteSubCategoryValidator, deleteSubCategoryController)
module.exports = router