var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');

var account = require('../models/account');
var authenticate = require('../authenticate');

var signupRouter = express.Router();

signupRouter.use(bodyParser.json());

signupRouter.post('/', authenticate.verifyUser, authenticate.verifyCreateUser, (req, res, next) => {
    account.register(new account({username: req.body.username, level: req.user.level + 1, name: req.body.name, IDCode: req.body.username}), req.body.password, (err, acc) => {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({error: err});
        }
    
        passport.authenticate('local')(req, res, () => {
        console.log("success");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registraion Successful!'})
        })
    })
});

module.exports = signupRouter;