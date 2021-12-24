var cors = require('cors');

const whitelist = [
    'http://localhost:3001',
    'https://localhost:3444'
]

var corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
}

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);
};

/**
 * reply back with Access-control-Allow-Origin: *
 */
exports.cors = cors();

exports.corsWithOptions = cors(corsOptionsDelegate);