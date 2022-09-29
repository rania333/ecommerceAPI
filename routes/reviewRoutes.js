const express = require('express')
const { getAllReviewsController, addReviewController, getSpecificReviewController, updateReviewController, deleteReviewController, setProductIdAndUserIdToBody, createFilterObj } = require('../controllers/reviewController')

const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')
const { createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../validators/reviewValidator')

const router = express.Router({ mergeParams: true })

router.route('/')
    .post(authenticatedUser, allowedTo('user'), setProductIdAndUserIdToBody, createReviewValidator, addReviewController)
    .get(createFilterObj, getAllReviewsController)

router.route('/:id')
    .get(getReviewValidator, getSpecificReviewController)
    .put(authenticatedUser, allowedTo('user'), updateReviewValidator, updateReviewController)
    .delete(authenticatedUser, allowedTo('user', 'admin', 'manager'), deleteReviewValidator, deleteReviewController)
module.exports = router