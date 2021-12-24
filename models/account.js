var mongoose = require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// level: country = 1, province = 2, district = 3, commune = 4, hamlet = 5
var account = new schema({
    level: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    IDCode: {
        type: Number,
        unique: true,
        required: true
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
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    finish: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
})

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', account)