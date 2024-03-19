const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    commands: [],
    module: []
})

const commandSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    disabled: [],
    channel: [channelSchema]
})

const model = mongoose.model('Commands', commandSchema)

module.exports = model;