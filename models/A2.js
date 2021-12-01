var mongoose = require('mongoose')
var schema = mongoose.Schema
require('./A1')

var a2schema = new schema({
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
        ref: 'A1'
    },
    modify: {
        type: Boolean,
        default: false
    }
})

var A2 = mongoose.model('A2', a2schema)

module.exports = A2