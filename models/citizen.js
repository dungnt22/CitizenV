var mongoose = require('mongoose')
var schema = mongoose.Schema
require('./account')

var citizenSchema = new schema({
    IDNumber: {
        type: Number
    },
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    sex: {
        type: String, // M: male, F: female
        required: true
    },
    homeTown: {
        type: String
    },
    permanentAddress: {
        type: String
    },
    temporaryAddress: {
        type: String
    },
    religion: {
        type: String,
        default: ''
    },
    educationLevel: {
        type: String
    },
    job: {
        type: String,
        default: ''
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
},{
    timestamps: true
})

var Citizen = mongoose.model('citizen', citizenSchema)

module.exports = Citizen