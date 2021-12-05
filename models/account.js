var mongoose = require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var account = new schema({
    level: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    telNum: {
        type: String,
        default: ''
    },
    modify: {
        type: Boolean,
        default: false
    }
})

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', account)