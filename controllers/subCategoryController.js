const subCategoryModel = require('../models/subCategoryModel')
const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController')


exports.setCategoryIdToBody = (req, res, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};


exports.createSubCategoryController = create(subCategoryModel)

exports.getAllSubCategoriesController = getAll(subCategoryModel)

exports.getSpecificSubCategoryController = getOne(subCategoryModel)

exports.updateSubCategoryController = update(subCategoryModel)

exports.deleteSubCategoryController = deleteOne(subCategoryModel)