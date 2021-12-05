var mongoose = require('mongoose');
var schema = mongoose.Schema;
require('./account');
require('./communes');

var hamlet = new schema({
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
        ref: 'Commune'
    }
})

var Hamlet = mongoose.model('Hamlet', hamlet);

module.exports = Hamlet;