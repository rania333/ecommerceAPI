const express = require('express')
const subcategoryRoutes = require('./subCategoryRoute')
const { addCategory, getAllCategory, getSpecificCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { updateCategoryValidator, deleteCategoryValidator, createCategoryValidator, getSpecificCategoryValidator } = require('../validators/categoryValidator')

const router = express.Router()

router.use('/:categoryId/subcategories', subcategoryRoutes)
router.route('/')
    .post(createCategoryValidator, addCategory)
    .get(getAllCategory)
router.route('/:id').get(getSpecificCategoryValidator, getSpecificCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)
module.exports = router