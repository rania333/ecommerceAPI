const reviewModel = require('../models/reviewModel')
const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController')

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
};

// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

exports.addReviewController = create(reviewModel)

exports.getAllReviewsController = getAll(reviewModel)

exports.getSpecificReviewController = getOne(reviewModel)

exports.updateReviewController = update(reviewModel)

exports.deleteReviewController = deleteOne(reviewModel)