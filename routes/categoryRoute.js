const express = require('express')
const subcategoryRoutes = require('./subCategoryRoute')
const { addCategory, getAllCategory, getSpecificCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { updateCategoryValidator, deleteCategoryValidator, createCategoryValidator, getSpecificCategoryValidator } = require('../validators/categoryValidator')
const { uploadCategory, resizeCategoryImage } = require('../middlewares/uploadImageMiddleware')
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use('/:categoryId/subcategories', subcategoryRoutes)
router.route('/')
    .post(authenticatedUser, allowedTo('admin', 'manager'), uploadCategory, resizeCategoryImage, createCategoryValidator, addCategory)
    .get(getAllCategory)
router.route('/:id').get(getSpecificCategoryValidator, getSpecificCategory)
    .put(authenticatedUser, allowedTo('admin', 'manager'), uploadCategory, resizeCategoryImage, updateCategoryValidator, updateCategory)
    .delete(authenticatedUser, allowedTo('admin'), deleteCategoryValidator, deleteCategory)
module.exports = router