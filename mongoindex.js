const mongoose = require('mongoose')
const express = require('express')
const app = express()
const PORT = 3000
require('dotenv').config()

async function mongo(){
    mongoose.connect(process.env.MONGO)
    return mongoose
}
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to mongo.")
})

mongo().then(() => {
    app.listen(PORT, () => {
        console.log("Listening for requests");
    })
})

module.exports = mongo