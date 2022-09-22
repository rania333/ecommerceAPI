const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const { ErrorHandler } = require('../utils/Error')
const subCategoryModel = require('../models/subCategoryModel')
const { ApiFeature } = require('../utils/apiFeature')

exports.setCategoryIdToBody = (req, res, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

exports.createSubCategoryController = asyncHandler(async (req, res, nxt) => {
    const { name, category } = req.body
    const subCategory = await subCategoryModel.create({
        name, slug: slugify(name), category
    })
    res.status(201).json({ message: 'A new subCategory is created successfully', data: subCategory })
})

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

exports.getAllSubCategoriesController = asyncHandler(async (req, res, nxt) => {
    const countDocuments = await subCategoryModel.countDocuments();
    const apiFeature = new ApiFeature(subCategoryModel.find(), req.query)
        .filtering().limitFields().pagination(countDocuments).search().sorting()

    const allSubCategories = await apiFeature.mongooseQuery
    // .populate({ path: 'category', select: 'name -_id' })
    res.status(200).json({ results: allSubCategories.length, pagination: apiFeature.paginationResult, data: allSubCategories }
    )
})

exports.getSpecificSubCategoryController = asyncHandler(async (req, res, nxt) => {
    const { id } = req.params
    const subCategory = await subCategoryModel.findById(id)
    if (!subCategory) return nxt(new ErrorHandler('there is no subCategory for this id: ' + id, 404))
    res.status(200).json({ data: subCategory })

})

exports.updateSubCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, category } = req.body
    const updatedCategory = await subCategoryModel.findOneAndUpdate({ _id: id },
        { name, slug: slugify(name), category }, { new: true })

    if (!updatedCategory) return nxt(new ErrorHandler('there is no subCategory for this id: ' + id, 404))
    res.status(200).json({ data: updatedCategory })

})

exports.deleteSubCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params
    const category = await subCategoryModel.findByIdAndDelete(id)
    if (!category) return nxt(new ErrorHandler('there is no subCategory for this id: ' + id, 404))
    res.status(200).json({ message: 'subCategory deleted successfully' })

})