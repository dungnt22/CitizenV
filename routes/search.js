var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var Citizen = require('../models/citizen');
var cors = require('./cors');

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());

searchRouter.route('/')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.body.IDNumber) {
        var level = req.user.level;
        if (level == 1) {
            Citizen.findOne({IDNumber: req.body.IDNumber})
            .then((citizen) => {
                if (!citizen) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: false,
                        message: 'Không tìm thấy người dân hợp lệ!'
                    })
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        citizen: citizen
                    })
                }
            }, (err) => next(err))
            .catch((err) => next(err))
        } else {
            Citizen.findOne({IDNumber: req.body.IDNumber})
            .then((citizen) => {
                if (citizen) {
                    var address = citizen.temporaryAddress.split(' - ');
                    var length = address.length;
                    var name = req.user.name;
                    if (name === address[length - level + 1]) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            citizen: citizen
                        })                
                    } else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: false,
                            message: 'Không tìm thấy người dân hợp lệ!'
                        })
                    }
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: false,
                        message: 'Không tìm thấy người dân hợp lệ!'
                    })
                }
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: false,
            message: "Dữ liệu không hợp lệ"
        })
    }
});

module.exports = searchRouter;