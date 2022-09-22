const mongoose = require('mongoose')

//connect to db
const dbConnection = () => {
    mongoose.connect(process.env.DB_LINK)
        .then(con => console.log('connected successfully to db: ', con.connection.host))
    // .catch(err => console.log('failed to connect to db: ', err))
}

module.exports = dbConnection