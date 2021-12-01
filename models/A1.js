var mongoose = require('mongoose')
var schema = mongoose.Schema

var a1Schema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    }
})

var A1 = mongoose.model('A1', a1Schema)

module.exports = A1