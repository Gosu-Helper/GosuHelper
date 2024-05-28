/**
 * SERVERS: {
 *              ALL: TRUE || FALSE || NULL
 *              SOME: [{ _id: SERVER_ID, users: [] }]
 *         }
 * USERS:   {
 *              ALL: TRUE || FALSE || NULL
 *              SOME: [{ _id: USER_ID, servers: [] }]
 *         }
 */
const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    users: []
})

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    servers: []
})

const serversSchema = mongoose.Schema({
    _id: {
        type: String,
        require: false
    },
    all: Boolean,
    some: [serverSchema]
})

const usersSchema = mongoose.Schema({
    _id: {
        type: String,
        require: false
    },
    all: Boolean,
    some: [userSchema]
})

const debugSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    servers: serversSchema,
    users: usersSchema
})

const model = mongoose.model('debug', debugSchema)

module.exports = model;