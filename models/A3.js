var mongoose = require('mongoose')
var schema = mongoose.Schema
require('./A2')

var a3schema = new schema({
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
        ref: 'A2'
    },
    modify: {
        type: Boolean,
        default: false
    }
})

var A3 = mongoose.model('A3', a3schema)

module.exports = A3