const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const { ErrorHandler } = require('../utils/Error')
const productModel = require('../models/productModel')

exports.addProductController = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title)
    const product = await productModel.create(req.body)
    res.status(201).json({ message: 'A new product is created successfully', data: product })

})

exports.getAllProductsController = asyncHandler(async (req, res) => {
    // filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'search', 'fields', 'keyword']
    excludedFields.forEach(field => delete queryObj[field])

    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    let mongooseQuery = productModel.find(JSON.parse(queryString))
        // .where("price").equals(req.query.price)
        .skip(skip).limit(limit)
        .populate({ path: 'category', select: 'name' })
    //sort
    if (req.query.sort) {
        mongooseQuery = mongooseQuery.sort(req.query.sort.replace(',', ' '))
    } else {
        mongooseQuery = mongooseQuery.sort("-createdAt")
    }

    //select specific fields to retrieve
    if (req.query.fields) {
        mongooseQuery = mongooseQuery.select(req.query.fields.replace(',', ' '))
    } else {
        mongooseQuery = mongooseQuery.select("-__v -_id")
    }

    //search
    if (req.query.keyword) {
        const query = {}
        query.$or = [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
        ]
        mongooseQuery = mongooseQuery.find(query)
    }
    const products = await mongooseQuery

    res.status(200).json({ results: products.length, page, data: products })
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