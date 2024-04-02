const mongoose = require('mongoose')

const nickSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    name: String,
    confirmed: Boolean
})

const youtubeSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: false
    },
    link: String,
    status: {
        type: String,
        require: true
    },
    confirmed: Boolean
})

const twitchSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: false
    },
    link: String,
    status: {
        type: String,
        require: true
    },
    confirmed: Boolean
})

const tiktokSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: false
    },
    link: String,
    status: {
        type: String,
        require: true
    },
    confirmed: Boolean
})

const instagramSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: false
    },
    link: String,
    status: {
        type: String,
        require: true
    },
    confirmed: Boolean
})

const promotionSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    youtube: youtubeSchema,
    twitch: twitchSchema,
    tiktok: tiktokSchema,
    instagram: instagramSchema
})

const applicationSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    nickname: nickSchema,
    promotion: promotionSchema
})

const model = mongoose.model('Application', applicationSchema)

module.exports = model;