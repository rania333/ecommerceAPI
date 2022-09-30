const express = require('express');
const { getAllCouponsController, createCouponController, getCouponController, updateCouponController, deleteCouponController } = require('../controllers/couponController');

const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware');
const { createCouponValidator, getCouponValidator, updateCouponValidator, deleteCouponValidator } = require('../validators/couponValidator');

const router = express.Router();

router.use(authenticatedUser, allowedTo('admin', 'manager'))

router.route('/')
    .get(getAllCouponsController)
    .post(createCouponValidator, createCouponController)
router
    .route('/:id')
    .get(getCouponValidator, getCouponController)
    .put(updateCouponValidator, updateCouponController)
    .delete(deleteCouponValidator, deleteCouponController)

module.exports = router;