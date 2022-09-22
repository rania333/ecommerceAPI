const express = require('express')
const { getAllProductsController, addProductController, getSpecificProductController, updateProductController, deleteProductController } = require('../controllers/productController')
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../validators/productValidator')

const router = express.Router()

router.route('/')
    .post(createProductValidator, addProductController)
    .get(getAllProductsController)
router.route('/:id').get(getProductValidator, getSpecificProductController)
    .put(updateProductValidator, updateProductController)
    .delete(deleteProductValidator, deleteProductController)
module.exports = router