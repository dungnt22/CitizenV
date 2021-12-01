var mongoose = require('mongoose')
var schema = mongoose.Schema
require('./A3')

var b1schema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        require: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'A3'
    },
    modify: {
        type: Boolean,
        default: false
    }
})

var B1 = mongoose.model('B1', b1schema)

module.exports = B1