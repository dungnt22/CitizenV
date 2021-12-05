var mongoose = require('mongoose');
var schema = mongoose.Schema;
require('./account');

var country = new schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Nha_Nuoc'
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
})

var Country = mongoose.model('Country', country)

module.exports = Country;