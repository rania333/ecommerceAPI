const path = require('path')

const dotenv = require('dotenv')
dotenv.config({ path: 'config.env' }) // lazem l step de l2n asm l file not .env
const express = require('express')
//routes
const categoryRoutes = require('./routes/categoryRoute')
const subCategoryRoutes = require('./routes/subCategoryRoute')
const brandRoutes = require('./routes/brandRoutes')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const wishRoutes = require('./routes/wishlistRoutes')


//global err
const { ErrorHandler } = require('./utils/Error')
const { ErrorMiddleware } = require('./middlewares/errMiddleware')

//db connection
const dbConnection = require('./config/database')
dbConnection()

const app = express()

//middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads'))) //mw to serve file

// route 
app.use('/category', categoryRoutes)
app.use('/subcategory', subCategoryRoutes)
app.use('/brand', brandRoutes)
app.use('/product', productRoutes)
app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/review', reviewRoutes)
app.use('/wishlist', wishRoutes)
app.all('*', (req, res, nxt) => {
    const err = new ErrorHandler("can't find this route", 500)
    nxt(err) //bb3t l err ll middleware
})

//err handler
app.use(ErrorMiddleware)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log('app listen on port: ', PORT)
})


// to handle any error outside express
process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection error', err.name, ' | ', err.message)
    server.close(() => { //b exit lma l server y close 3l4an lw feh ay pending req y3mlha l awl
        process.exit(1)
    })
})