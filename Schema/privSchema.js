const mongoose = require('mongoose')

const privSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    priv: []
})

const model = mongoose.model('Privates', privSchema)

module.exports = model;