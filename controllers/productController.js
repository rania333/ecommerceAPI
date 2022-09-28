const productModel = require('../models/productModel')
const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController')

exports.addProductController = create(productModel)

exports.getAllProductsController = getAll(productModel, "Product")

exports.getSpecificProductController = getOne(productModel)

exports.updateProductController = update(productModel)

exports.deleteProductController = deleteOne(productModel)