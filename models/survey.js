var mongoose = require('mongoose');
var schema = mongoose.Schema;

require('./account');

var surveyModel = new schema({
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    finish: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'account'
        }
    ]
}, {
    timestamps: true
})

var Survey = mongoose.model('Survey', surveyModel);

module.exports = Survey;