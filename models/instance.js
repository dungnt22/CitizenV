var mongoose = require('mongoose');
var schema = mongoose.Schema;
require('./account');

var instance = new schema({
    zipCode: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        default: ''
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    }
})

var Instance = mongoose.model('Instance', instance);

module.exports = Instance;