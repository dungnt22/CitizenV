var mongoose = require('mongoose');
var schema = mongoose.Schema;
require('./account');
require('./country');

var province = new schema({
    code: {
        type: Number,
        min: 1,
        max: 63,
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
        ref: 'Country'
    }
})

var Province = mongoose.model('Province', province)

module.exports = Province