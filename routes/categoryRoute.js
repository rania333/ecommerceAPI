const express = require('express')
const subcategoryRoutes = require('./subCategoryRoute')
const { addCategory, getAllCategory, getSpecificCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { updateCategoryValidator, deleteCategoryValidator, createCategoryValidator, getSpecificCategoryValidator } = require('../validators/categoryValidator')
const { uploadCategory, resizeImage } = require('../middlewares/uploadImageMiddleware')

const router = express.Router()

router.use('/:categoryId/subcategories', subcategoryRoutes)
router.route('/')
    .post(uploadCategory, resizeImage, createCategoryValidator, addCategory)
    .get(getAllCategory)
router.route('/:id').get(getSpecificCategoryValidator, getSpecificCategory)
    .put(uploadCategory, resizeImage, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)
module.exports = router