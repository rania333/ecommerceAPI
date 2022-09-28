const reviewModel = require('../models/reviewModel')
const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController')



exports.addReviewController = create(reviewModel)

exports.getAllReviewsController = getAll(reviewModel)

exports.getSpecificReviewController = getOne(reviewModel)

exports.updateReviewController = update(reviewModel)

exports.deleteReviewController = deleteOne(reviewModel)