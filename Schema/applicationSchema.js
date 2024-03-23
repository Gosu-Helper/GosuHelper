const mongoose = require('mongoose')

const nickSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    name: String,
    confirmed: Boolean
})

const commandSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    nickname: nickSchema
    //promotion: [channelSchema]
})

const model = mongoose.model('Application', commandSchema)

module.exports = model;