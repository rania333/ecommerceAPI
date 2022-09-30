const asyncHandler = require('express-async-handler');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const couponModel = require('../models/couponModel')
const { ErrorHandler } = require('../utils/Error')

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

exports.addPrdToCart = asyncHandler(async (req, res) => {
    // check if cart exist
    let { prdId, color } = req.body
    let newCart;
    let cart = await cartModel.findOne({ user: req.user._id })
    let product = await productModel.findById(prdId)

    if (!cart) {
        // create one
        let newCart = await cartModel.create({
            cartItems: { product: prdId, color, price: product.price },
            user: req.user._id
        })
        newCart.totalCartPrice += product.price
        newCart.totalPriceAfterDiscount = undefined
        newCart = await newCart.save()
        return res.status(201).json({
            message: 'A cart is created successfully and a product added',
            data: newCart
        })
    } else {
        // if prd exist, increase qnt
        let itemIndex = cart.cartItems.findIndex(item => item.product.toString() == prdId.toString() && item.color == color)
        if (itemIndex >= 0) {
            cart.cartItems[itemIndex].quantity += 1;
        } else {
            cart.cartItems.push({ product: prdId, color, price: product.price })
        }
    }

    //increase total price
    cart.totalCartPrice += product.price
    cart.totalPriceAfterDiscount = undefined

    newCart = await cart.save()
    res.status(200).json({ message: 'Product added to cart successfully', cartData: newCart })
})

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(
            new ErrorHandler(`There is no cart for this user id : ${req.user._id}`, 404)
        );
    }

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    // find the deleted item
    const allCart = await cartModel.findOne({ user: req.user._id })
    const deletedItemIndex = allCart.cartItems.findIndex(item => item._id.toString() == req.params.itemId.toString())
    const deletedItem = allCart.cartItems[deletedItemIndex].product

    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } },
        },
        { new: true }
    )
    // find this product
    const prd = await productModel.findById(deletedItem)
    cart.totalCartPrice -= prd.price
    cart.totalPriceAfterDiscount = undefined //3l4an myzhrhash

    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
    await cartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send({ message: 'Cart deleted successfully' });
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ErrorHandler(`there is no cart for user ${req.user._id}`, 404));
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(
            new ErrorHandler(`there is no item for this id :${req.params.itemId}`, 404)
        );
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});


exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await couponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });

    if (!coupon) {
        return next(new ErrorHandler(`Coupon is invalid or expired`));
    }

    // 2) Get logged user cart to get total cart price
    const cart = await cartModel.findOne({ user: req.user._id });

    const totalPrice = cart.totalCartPrice;

    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (
        totalPrice -
        (totalPrice * coupon.discount) / 100
    ).toFixed(2); // 99.23

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});
