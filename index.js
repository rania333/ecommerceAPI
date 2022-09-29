const path = require('path')

const dotenv = require('dotenv')
dotenv.config({ path: 'config.env' }) // lazem l step de l2n asm l file not .env
const express = require('express')
//routes

//global err
const { ErrorMiddleware } = require('./middlewares/errMiddleware')

//db connection
const dbConnection = require('./config/database')
const { mountRoute } = require('./routes')
dbConnection()

const app = express()

//middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads'))) //mw to serve file

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
        process.exit(1)
    })
})