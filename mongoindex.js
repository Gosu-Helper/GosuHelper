const mongoose = require('mongoose')
require('dotenv').config()

module.exports = async () => {
    mongoose.connect(process.env.MONGO)
    return mongoose
}
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to mongo.")
})