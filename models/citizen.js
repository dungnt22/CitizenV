var mongoose = require('mongoose')
var schema = mongoose.Schema
require('./B2')

var citizenSchema = new schema({
    firstname: {
        type: String,
        default: '',
        required: true
    },
    lastname: {
        type: String,
        default: '',
        required: true
    },
    ID: {
        type: Number,
        default: '',
        required: true
    },
    sex: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    telNum: {
        type: Number
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'B2'
    }
},{
    timestamps: true
})

var Citizen = mongoose.model('citizen', citizenSchema)

module.exports = Citizen