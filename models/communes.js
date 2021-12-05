var mongoose = require('mongoose');
var schema = mongoose.Schema;
require('./account');
require('./districts');

var commune = new schema({
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
        ref: 'District'
    }
})

var Commune = mongoose.model('Commune', commune)

module.exports = Commune