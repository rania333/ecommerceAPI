const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const { ErrorHandler } = require('../utils/Error')
const productModel = require('../models/productModel')
const { ApiFeature } = require('../utils/apiFeature')

exports.addProductController = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title)
    const product = await productModel.create(req.body)
    res.status(201).json({ message: 'A new product is created successfully', data: product })

})

exports.getAllProductsController = asyncHandler(async (req, res) => {

    const apiFeature = new ApiFeature(productModel.find(), req.query)
        .filtering().limitFields().pagination().search().sorting()
    // .populate({ path: 'category', select: 'name' })
    // .where("price").equals(req.query.price)

    //excute query
    const products = await apiFeature.mongooseQuery

    res.status(200).json({ results: products.length, page: apiFeature.page, data: products })
})

exports.getSpecificProductController = asyncHandler(async (req, res, nxt) => {
    const { id } = req.params
    const product = await productModel.findById(id)
        .populate({ path: 'category', select: 'name' })

    if (!product) return nxt(new ErrorHandler('there is no product for this id: ' + id, 404))
    res.status(200).json({ data: product })
})

exports.updateProductController = asyncHandler(async (req, res, nxt) => {
    const { id } = req.params
    if (req.body.title) req.body.slug = slugify(req.body.title)
    const product = await productModel.findOneAndUpdate({ _id: id },
        req.body, { new: true })

    if (!product) return nxt(new ErrorHandler('there is no product for this id: ' + id, 404))
    res.status(200).json({ data: product })

})

exports.deleteProductController = asyncHandler(async (req, res, nxt) => {
    const { id } = req.params
    const product = await productModel.findByIdAndDelete(id)
    if (!product) return nxt(new ErrorHandler('there is no product for this id: ' + id, 404))
    res.status(200).json({ message: 'product deleted successfully' })

})