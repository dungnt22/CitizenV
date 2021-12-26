var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var Instance = require('../models/instance');
var cors = require('./cors');

const declareRouter = express.Router();
declareRouter.use(bodyParser.json());

declareRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
/**
 * trả về danh sách các địa phương mà nó quản lý
 */
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Instance.find({manager: req.user._id})
    .then((ins) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ins)
    }, (err) => next(err))
    .catch((err) => next(err))
})
/**
 * khai báo địa phương mới
 */
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyCreateUser, (req, res, next) => {
    var level = req.user.level;
    var zipCode = req.user.IDCode;
    if (level == 1) {
        if (req.body.zipCode < 1 || req.body.zipCode > 63) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Mã khai báo không hợp lệ!'
            })
        } else {
            Instance.create({
                zipCode: req.body.zipCode,
                name: req.body.name,
                level: level + 1,
                manager: req.user._id
            })
            .then((ins) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ins);
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    } else {
        if (req.body.zipCode < (zipCode * 100 + 1) || req.body.zipCode > (zipCode * 100 + 99)) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Mã khai báo không hợp lệ!'
            })
        } else {
            Instance.create({
                zipCode: req.body.zipCode,
                name: req.body.name,
                level: level + 1,
                manager: req.user._id
            })
            .then((ins) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ins);
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

});

module.exports = declareRouter;