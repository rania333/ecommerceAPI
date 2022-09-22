const brandModel = require('../models/brandModel');
const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController')

exports.getBrandsController = getAll(brandModel)

exports.getBrandController = getOne(brandModel)

exports.createBrandController = create(brandModel)

exports.updateBrandController = update(brandModel)

exports.deleteBrandController = deleteOne(brandModel)