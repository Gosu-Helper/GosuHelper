const mongoose = require('mongoose')

const defNum = {
    type: Number,
    default: 0,
    require: true
}

const savedRolesSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    level: defNum,
    exp: defNum,
    lastSent: defNum
})

const model = mongoose.model("UserLevel", savedRolesSchema)

module.exports = model;