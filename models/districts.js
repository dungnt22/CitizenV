var mongoose = require('mongoose');
var schema = mongoose.Schema;
require('./account');
require('./provinces')

var district = new schema({
    code: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province'
    }
})

var District = mongoose.model('District', district);

module.exports = District;