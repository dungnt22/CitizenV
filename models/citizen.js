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
<<<<<<< HEAD
        type: String, // M: male, F: female
=======
        type: String,
>>>>>>> a30d02da63133a4302dca9bbea3ed470c835841d
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
    hamletCode: {
        type: Number
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