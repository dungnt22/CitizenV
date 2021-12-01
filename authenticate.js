var passport = require('passport');
var JwtStratery = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // use to create, sign and verify tokens

var A1 = require('./models/A1');
var A2 = require('./models/A2');
var A3 = require('./models/A3');
var B1 = require('./models/B1');
var B2 = require('./models/B2');
var config = require('./config');

// user could be an object literal, buffer or string representing valid JSON
// yeu cau dang nhap lai sau 1 tieng
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
}

// create a new extractor that looks for the JWT in the authorization header with the schema 'bearer' 
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStratery(opts, (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    A1.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, null);
        } else if (user) {
            return done(null, user);
        }
    });
    A2.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, null);
        } else if (user) {
            return done(null, user);
        }
    });
    A3.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, null);
        } else if (user) {
            return done(null, user);
        }
    });
    B1.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err,null);
        } else if (user) {
            return done(null, user);
        }
    });
    B2.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, null);
        } else if (user) {
            return done(null, user);
        }
    })
    return done(null, false);
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

