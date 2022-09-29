const express = require('express')
const { addProductToWishlist, removeProductFromWishlist, getLoggedUserWishlist } = require('../controllers/wishlistController')
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')
const { createWishlistValidator, deleteWishlistValidator } = require('../validators/wishlistValidator')

const router = express.Router()

router.use(authenticatedUser, allowedTo('user'))

router.post('/', createWishlistValidator, addProductToWishlist)
router.delete('/:productId', deleteWishlistValidator, removeProductFromWishlist)
router.get('/', getLoggedUserWishlist)

module.exports = router