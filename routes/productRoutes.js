const express = require('express')
const { getAllProductsController, addProductController, getSpecificProductController, updateProductController, deleteProductController } = require('../controllers/productController')
const { uploadProduct, resizeProductImage } = require('../middlewares/uploadImageMiddleware')
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../validators/productValidator')

const router = express.Router()

router.route('/')
    .post(uploadProduct, resizeProductImage, createProductValidator, addProductController)
    .get(getAllProductsController)
router.route('/:id').get(getProductValidator, getSpecificProductController)
    .put(uploadProduct, resizeProductImage, updateProductValidator, updateProductController)
    .delete(deleteProductValidator, deleteProductController)
module.exports = router