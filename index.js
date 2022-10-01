const path = require('path')

const dotenv = require('dotenv')
dotenv.config({ path: 'config.env' }) // lazem l step de l2n asm l file not .env
const express = require('express')
const cors = require('cors');
const compression = require('compression');
const rateLimiter = require('express-rate-limit')
//routes

//global err
const { ErrorMiddleware } = require('./middlewares/errMiddleware')

//db connection
const dbConnection = require('./config/database')
const { mountRoute } = require('./routes');
const { webhookCheckout } = require('./controllers/orderController');
dbConnection()

const app = express()

app.use(cors());
app.options('*', cors());
app.use(compression())

// Checkout webhook
app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    webhookCheckout
);

//middlewares
app.use(express.json({ limit: '20mb' }))
app.use(express.static(path.join(__dirname, 'uploads'))) //mw to serve file

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
        'Too many accounts created from this IP, please try again after an hour',
});

// Apply the rate limiting middleware to all requests
app.use('/', limiter);


// mount route 
mountRoute(app)
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
        process.exit(1) // de bt5ly l app y crash
    })
})