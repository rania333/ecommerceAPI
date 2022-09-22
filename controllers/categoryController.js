const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const { ErrorHandler } = require('../utils/Error')
const categoryModel = require('../models/categoryModel')
const { ApiFeature } = require('../utils/apiFeature')


exports.addCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    const category = await categoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ message: 'A new category is created successfully', data: category })

})

exports.getAllCategory = asyncHandler(async (req, res) => {
    const countDocuments = await categoryModel.countDocuments();
    const apiFeature = new ApiFeature(categoryModel.find(), req.query)
        .filtering().limitFields().pagination(countDocuments).search().sorting()

    const categories = await apiFeature.mongooseQuery

    res.status(200).json({ results: categories.length, pagination: apiFeature.paginationResult, data: categories })
})

exports.getSpecificCategory = asyncHandler(async (req, res, nxt) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)
    // if (!category) res.status(404).json({ message: 'there is no category for this id: ' + id })

    if (!category) return nxt(new ErrorHandler('there is no category for this id: ' + id, 404))
    res.status(200).json({ data: category })
})

exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, slug } = req.body
    const category = await categoryModel.findOneAndUpdate({ _id: id },
        { name, slug: slugify(name) }, { new: true })

    if (!category) return nxt(new ErrorHandler('there is no category for this id: ' + id, 404))
    res.status(200).json({ data: category })

})

exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    if (!category) return nxt(new ErrorHandler('there is no category for this id: ' + id, 404))
    res.status(200).json({ message: 'category deleted successfully' })

})