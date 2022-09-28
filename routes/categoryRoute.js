const express = require('express')
const subcategoryRoutes = require('./subCategoryRoute')
const { addCategory, getAllCategory, getSpecificCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { updateCategoryValidator, deleteCategoryValidator, createCategoryValidator, getSpecificCategoryValidator } = require('../validators/categoryValidator')
const { uploadCategory, resizeCategoryImage } = require('../middlewares/uploadImageMiddleware')
const { authenticatedUser } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use('/:categoryId/subcategories', subcategoryRoutes)
router.route('/')
    .post(authenticatedUser, uploadCategory, resizeCategoryImage, createCategoryValidator, addCategory)
    .get(getAllCategory)
router.route('/:id').get(getSpecificCategoryValidator, getSpecificCategory)
    .put(uploadCategory, resizeCategoryImage, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)
module.exports = router