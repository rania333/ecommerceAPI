const express = require('express');
const { createOrder, filterOrderForLoggedUser, findAllOrders, findSpecificOrder, updateOrderToPaid, updateOrderToDelivered } = require('../controllers/orderController');

const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')


const router = express.Router();
router.use(authenticatedUser)

router.route('/').post(allowedTo('user'), createOrder);

router.get(
    '/',
    allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser,
    findAllOrders
);
router.get('/:id', filterOrderForLoggedUser, findSpecificOrder);

router.put(
    '/:id/pay',
    allowedTo('admin', 'manager'),
    updateOrderToPaid
);
router.put(
    '/:id/deliver',
    allowedTo('admin', 'manager'),
    updateOrderToDelivered
);


module.exports = router;