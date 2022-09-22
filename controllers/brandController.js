const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../utils/Error')
const brandModel = require('../models/brandModel');
const { ApiFeature } = require('../utils/apiFeature')

exports.getBrandsController = asyncHandler(async (req, res) => {
    const countDocuments = await brandModel.countDocuments();
    const apiFeature = new ApiFeature(brandModel.find(), req.query)
        .filtering().limitFields().pagination(countDocuments).search().sorting()

    const brands = await apiFeature.mongooseQuery

    res.status(200).json({ results: brands.length, pagination: apiFeature.paginationResult, data: brands });
});

exports.getBrandController = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id);
    if (!brand) {
        return next(new ErrorHandler(`No brand for this id ${id}`, 404));
    }
    res.status(200).json({ data: brand });
});

exports.createBrandController = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await brandModel.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });
});

exports.updateBrandController = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const brand = await brandModel.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );

    if (!brand) {
        return next(new ErrorHandler(`No brand for this id ${id}`, 404));
    }
    res.status(200).json({ data: brand });
});

exports.deleteBrandController = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findByIdAndDelete(id);

    if (!brand) {
        return next(new ErrorHandler(`No brand for this id ${id}`, 404));
    }
    res.status(200).json({ message: 'brand deleted successfully' });
});