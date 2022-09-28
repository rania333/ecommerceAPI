const express = require('express')
const { getAllProductsController, addProductController, getSpecificProductController, updateProductController, deleteProductController } = require('../controllers/productController')
const { uploadProduct, resizeProductImage } = require('../middlewares/uploadImageMiddleware')
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../validators/productValidator')
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/')
    .post(authenticatedUser, allowedTo('admin', 'manager'), uploadProduct, resizeProductImage, createProductValidator, addProductController)
    .get(getAllProductsController)
router.route('/:id').get(getProductValidator, getSpecificProductController)
    .put(authenticatedUser, allowedTo('admin', 'manager'), uploadProduct, resizeProductImage, updateProductValidator, updateProductController)
    .delete(authenticatedUser, allowedTo('admin'), deleteProductValidator, deleteProductController)
module.exports = router