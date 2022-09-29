const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const { ErrorHandler } = require('../utils/Error')
const { ApiFeature } = require('../utils/apiFeature')


exports.create = (model) =>
    asyncHandler(async (req, res) => {
        const { name, title } = req.body;
        const doc = await model.create({ ...req.body, slug: slugify(name || title) });
        res.status(201).json({ data: doc });
    });


exports.getAll = (model, modelName) =>
    asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        const countDocuments = await model.countDocuments();
        const apiFeature = new ApiFeature(model.find(filter), req.query)
            .filtering().limitFields().pagination(countDocuments).search(modelName).sorting()

        const docs = await apiFeature.mongooseQuery
        res.status(200).json({ results: docs.length, pagination: apiFeature.paginationResult, data: docs });
    });

exports.getOne = (model, populate) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // build query
        let query = model.findById(id);
        if (populate) {
            query = query.populate(populate)
        }
        // run query
        const doc = await query
        if (!doc) {
            return next(new ErrorHandler(`No document for this id ${id}`, 404));
        }
        res.status(200).json({ data: doc });
    });


exports.update = (model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const { name, title } = req.body;
        const slugged = (name || title) ? slugify(name || title) : undefined
        const doc = await model.findOneAndUpdate(
            { _id: id },
            { ...req.body, slug: slugged },
            { new: true }
        );

        if (!doc) {
            return next(new ErrorHandler(`No document for this id ${id}`, 404));
        }
        res.status(200).json({ data: doc });
    });


exports.deleteOne = (model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const doc = await model.findByIdAndDelete(id);

        if (!doc) {
            return next(new ErrorHandler(`No document for this id ${id}`, 404));
        }
        res.status(200).json({ message: 'document deleted successfully' });
    });
