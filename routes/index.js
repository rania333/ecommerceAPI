const { ErrorHandler } = require('../utils/Error')
const categoryRoutes = require('./categoryRoute')
const subCategoryRoutes = require('./subCategoryRoute')
const brandRoutes = require('./brandRoutes')
const productRoutes = require('./productRoutes')
const userRoutes = require('./userRoutes')
const authRoutes = require('./authRoutes')
const reviewRoutes = require('./reviewRoutes')
const wishRoutes = require('./wishlistRoutes')
const addressRoutes = require('./addressRoute')
const couponRoutes = require('./couponRoutes')
const cartRoutes = require('./cartrRoutes')


exports.mountRoute = (app) => {
    app.use('/category', categoryRoutes)
    app.use('/subcategory', subCategoryRoutes)
    app.use('/brand', brandRoutes)
    app.use('/product', productRoutes)
    app.use('/user', userRoutes)
    app.use('/auth', authRoutes)
    app.use('/review', reviewRoutes)
    app.use('/wishlist', wishRoutes)
    app.use('/address', addressRoutes)
    app.use('/coupon', couponRoutes)
    app.use('/cart', cartRoutes)
    app.all('*', (req, res, nxt) => {
        const err = new ErrorHandler("can't find this route", 500)
        nxt(err) //bb3t l err ll middleware
    })
} 