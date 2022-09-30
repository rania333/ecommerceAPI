const express = require('express');
const { addPrdToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, updateCartItemQuantity, applyCoupon } = require('../controllers/cartController');
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware');
const { createCartValidator } = require('../validators/cartValidator');

const router = express.Router();

router.use(authenticatedUser, allowedTo('user'))

router.put('/applycoupon', applyCoupon)

router.route('/')
    .post(createCartValidator, addPrdToCart)
    .get(getLoggedUserCart)
    .delete(clearCart)

router.delete('/:itemId', removeSpecificCartItem)
    .put('/:itemId', updateCartItemQuantity)
module.exports = router;