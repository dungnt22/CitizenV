var mongoose = require('mongoose')
var schema = mongoose.Schema
require('./B1')

var b2schema = new schema({
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
        ref: 'B1'
    },
    modify: {
        type: Boolean,
        default: false
    }
})

var B2 = mongoose.model('B2', b2schema)

module.exports = B2