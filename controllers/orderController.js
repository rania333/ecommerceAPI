const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const orderModel = require('../models/orderModel')
const couponModel = require('../models/couponModel')

const { ErrorHandler } = require('../utils/Error');
const { getAll, getOne } = require('./factoryHandlerController');


exports.createOrder = asyncHandler(async (req, res, nxt) => {
    const { details, phone, city, postalCode, payment } = req.body
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // get cart items
    const userCart = await cartModel.findOne({ user: req.user._id })
    if (!userCart) {
        return nxt(new ErrorHandler("You don't have any product in cart, add one at least", 404))
    }
    const cartItems = userCart.cartItems
    // get price (if there is coupon or not)
    const cartPrice = userCart.totalPriceAfterDiscount || userCart.totalCartPrice
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // create order with cash payment
    const order = await orderModel.create({
        user: req.user._id,
        cartItems,
        shippingAddress: { details, phone, city, postalCode },
        totalOrderPrice: totalOrderPrice,
        paymentMethodType: payment,
    })
    // decrement qnt & increment sold => prd model
    if (order) {
        const bulkOption = cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        }));

        await productModel.bulkWrite(bulkOption, {})
        // clear cart
        await cartModel.findOneAndDelete({ user: req.user._id });
        res.status(201).json({ status: 'success', data: order });
    }
})


exports.filterOrderForLoggedUser = asyncHandler(async (req, res, nxt) => {
    if (req.user.role === 'user') req.filterObj = { user: req.user._id };
    nxt();
});

exports.findAllOrders = getAll(orderModel);

exports.findSpecificOrder = getOne(orderModel);


exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(
            new ErrorHandler(
                `There is no such a order with this id:${req.params.id}`,
                404
            )
        );
    }

    // update order to paid
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ status: 'success', data: updatedOrder });
});


exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(
            new ErrorHandler(
                `There is no such a order with this id:${req.params.id}`,
                404
            )
        );
    }

    // update order to paid
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ status: 'success', data: updatedOrder });
});


// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        return next(
            new ErrorHandler(`There is no such cart with id ${cart._id}`, 404)
        );
    }

    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount || cart.totalCartPrice

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                name: req.user.name,
                amount: totalOrderPrice * 100,
                currency: 'egp',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id,
        metadata: req.body.shippingAddress,
    });

    // 4) send session to response
    res.status(200).json({ status: 'success', session });
});