const categoryModel = require('../models/categoryModel')
const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController')



exports.addCategory = create(categoryModel)

exports.getAllCategory = getAll(categoryModel)

exports.getSpecificCategory = getOne(categoryModel)

exports.updateCategory = update(categoryModel)

exports.deleteCategory = deleteOne(categoryModel)