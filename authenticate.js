var passport = require('passport');
var LocalStratery = require('passport-local').Strategy;
var JwtStratery = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // use to create, sign and verify tokens

var Account = require('./models/account');
var config = require('./config');

passport.use(new LocalStratery(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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
    Account.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});
 
exports.verifyCreateUser = function(req, res, next) {
    if (req.user.level < 5) {
        next()
    } else {
        var err = new Error('Bạn không có quyền tạo tài khoản mới!');
        err.status = 401;
        next(err);
    }
}

exports.verifyAdmin = function(req, res, next) {
    if (req.user.level === 1) {
        next()
    } else {
        var err = new Error('Bạn không có quyền xóa khảo sát này!');
        err.status = 401;
        next(err);
    }
}

exports.verifyUpload = function(req, res, next) {
    if (req.user.modify && (req.user.level == 4 || req.user.level == 5)) {
        next()
    } else {
        var err = new Error('Không thể upload file!' + '\n' + 'Khảo sát đã kết thúc hoặc Bạn không có quyền tham gia khảo sát này!');
        err.status = 401;
        next(err);
    }
}

exports.verifyModify = function(req, res, next) {
    if (req.user.modify) {
        next();
    } else {
        var err = new Error('Bạn không có quyền tham gia khảo sát!');
        err.status = 401;
        next(err);
    }
}