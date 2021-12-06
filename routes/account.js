var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var account = require('../models/account');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  account.register(new account({username: req.body.username, level: req.body.level, name: req.body.name, IDCode: req.body.username}), req.body.password, (err, acc) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({error: err});
    }

    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registraion Successful!'})
    })
  })
});

/**
 * login
 * by default
 * if authentication fails, Passport will response with 401 Unauthorized status
*/
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'You are successfully logged in!'
  })
});

/** logout
 * redirect to '/'
 * 
*/
router
.get('/logout', (req, res, next) => {
  res.redirect('/');
});

/* update account */
router.put('/updateAccount', authenticate.verifyUser, (req, res, next) => {
  account.findByIdAndUpdate({_id: req.user._id}, {$set: req.body}, {new: true})
  .then((account) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(account);
  }, (err) => {
    next(err)
  })
  .catch((err) => next(err))
});

module.exports = router;
// https://github.com/hardillb/2FA-Demo/blob/f268e76c686c20706c904c722e7b545d078b9c62/index.js#L125