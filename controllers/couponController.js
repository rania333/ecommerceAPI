const { create, deleteOne, getAll, getOne, update } = require('./factoryHandlerController');
const couponModel = require('../models/couponModel');

exports.getAllCouponsController = getAll(couponModel);

exports.getCouponController = getOne(couponModel);

exports.createCouponController = create(couponModel);

exports.updateCouponController = update(couponModel);

exports.deleteCouponController = deleteOne(couponModel);