var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var fastcsv = require('fast-csv');

var account = require('../models/account');
var authenticate = require('../authenticate');
var citizen = require('../models/citizen');
var survey = require('../models/survey');
var cors = require('./cors');

const storage = multer.diskStorage({
    // determine within which folder the uploaded files should be stored
    destination: (req, file, cb) => {
        cb(null, 'public/data');
    },
    // determine what the file should be named inside the folder
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

/**
 * chỉ chấp nhận file .csv
 */
const fileFilter = (req, file, cb) => {
    if (!(/\.csv$/).test(file.originalname)) {
        return cb(new Error('Bạn chỉ được upload file .csv'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

/**
 * upload file dữ liệu lên server
 * tài khoản cấp 4, 5 được quyền upload file dữ liệu
 * khi upload thành công, trường finish của tài khoản được cập nhập thành true
 * thêm tài khoản hoàn thành khảo sát vào survay.finish
 */
uploadRouter.route('/')
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyUpload, upload.single('file'), (req, res, next) => {
    var stream = fs.createReadStream(req.file.path);
    var csvData = [];
    var csvStream = fastcsv
        .parse()
        .on('data', (data) => {
            csvData.push({
                IDNumber: Number(data[0]),
                fullName: data[1],
                dateOfBirth: data[2],
                sex: data[3],
                homeTown: data[4],
                permanentAddress: data[5],
                temporaryAddress: data[6],
                religion: data[7],
                educationLevel: data[8],
                job: data[9],
                hamletCode: data[10],
                manager: req.user.level == 4 ? req.user._id : req.user.manager
            });
        })
        .on('end', () => {
            csvData.shift();
            if (req.user.level == 4) {
                citizen.deleteMany({manager: req.user._id})
                .then((x) => {
                    citizen.insertMany(csvData, (err, citizens) => {
                        if (err) {
                            return next(err);
                        } else {
                            account.findByIdAndUpdate({_id: req.user._id}, {$set: {finish: true}}, {new: true}, (err, acc) => {
                                if (err) {
                                    return next(err);
                                }
                            });
                            survey.findOne({dateStart: {$lt: Date.now()}, dateEnd: {$gt: Date.now()}}, (err, sur) => {
                                if (err) {
                                    return next(err);
                                } else {
                                    var arr = sur.finish;
                                    if (!arr.includes(req.user._id)) {
                                        sur.finish.push(req.user._id);
                                        sur.save((err) => {
                                            if (err) next(err)
                                        })
                                    }
                                }
                            })
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(citizens);
                        }
                    })
                })
                .catch((err) => next(err))            
            } else {
                citizen.deleteMany({hamletCode: req.user.IDCode})
                .then((x) => {
                    citizen.insertMany(csvData, (err, citizens) => {
                        if (err) {
                            return next(err);
                        } else {
                            account.findByIdAndUpdate({_id: req.user._id}, {$set: {finish: true}}, {new: true}, (err, acc) => {
                                if (err) {
                                    return next(err);
                                }
                            });
                            survey.findOne({dateStart: {$lt: Date.now()}, dateEnd: {$gt: Date.now()}}, (err, sur) => {
                                if (err) {
                                    return next(err);
                                } else {
                                    var arr = sur.finish;
                                    if (!arr.includes(req.user._id)) {
                                        sur.finish.push(req.user._id);
                                        sur.save((err) => {
                                            if (err) next(err)
                                        })
                                    }
                                }
                            })
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(citizens);
                        }
                    })
                })
                .catch((err) => next(err))
            }
        });
    stream.pipe(csvStream);
});

module.exports = uploadRouter;