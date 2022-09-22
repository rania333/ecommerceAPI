const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../utils/Error')
const brandModel = require('../models/brandModel');

exports.getBrandsController = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const brands = await brandModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: brands.length, page, data: brands });
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