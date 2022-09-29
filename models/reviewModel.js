const mongoose = require('mongoose');
const productModel = require('./productModel');

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        ratings: {
            type: Number,
            min: [1, 'Min ratings value is 1.0'],
            max: [5, 'Max ratings value is 5.0'],
            required: [true, 'review ratings required'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to user'],
        },
        // parent reference (one to many)
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to product'],
        },
    },
    { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
});

// aggregation
reviewSchema.statics.calcReview = async function (prodId) {
    const res = await this.aggregate([
        { $match: { product: prodId } },
        {
            $group: {
                _id: 'product',
                reviewCount: { $sum: 1 },
                reviewAvg: { $avg: '$ratings' }
            }
        }
    ])
    if (res.length) {
        await productModel.findByIdAndUpdate(prodId,
            { ratingsAverage: res[0].reviewAvg, ratingsQuantity: res[0].reviewCount })
    } else {
        await productModel.findByIdAndUpdate(prodId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
}

reviewSchema.post('save', async function () {
    await this.constructor.calcReview(this.product)
})

reviewSchema.post('remove', async function () {
    await this.constructor.calcReview(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);