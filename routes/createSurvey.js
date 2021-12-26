var express = require('express');
var bodyParser = require('body-parser');

var account = require('../models/account');
var survey = require('../models/survey');
var authenticate = require('../authenticate');
var cors = require('./cors');

const createNew = express.Router();

createNew.use(bodyParser.json());

createNew.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
/**
 * get request
 * trả về danh sách các khảo sát đã và đang diễn ra
 * 
 * và
 * 
 * nếu đang có khảo sát diễn ra
 * trả về thời gian bắt đầu, kết thúc, tên khảo sát, danh sách tất cả cấp dưới
 * 
 * nếu không có khảo sát diễn ra
 * tài khoản cấp 1: trả về giao diện để tạo khảo sát mới
 * tài khoản cấp khác: trả về thông báo ko có khảo sát nào đang diễn ra
 * 
 * nếu không có khảo sát nào đang diễn ra, tất cả các tài khoản set modify = false, finish = false
 */
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    survey.find({})
    .then((surveys) => {
        var sur = surveys[surveys.length - 1];
        if ((new Date().getTime() >= sur.dateStart.getTime()) && (new Date().getTime() <= sur.dateEnd.getTime())) {
            // account.find({manager: req.user._id})
            // .then((accounts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    dateStart: sur.dateStart,
                    dateEnd: sur.dateEnd,
                    name: sur.name,
                    message: 'Đang diễn ra khảo sát!',
                    // accounts: accounts,
                    surveys: surveys
                })
            // }, (err) => next(err))
            // .catch((err) => next(err))
        } else {
            account.findById({_id: req.user._id})
            .then((acc) => {
                if (acc.level === 1) {
                    account.updateMany({}, {$set: {modify: false, finish: false}})
                    .then((accs) => {
                        acc.modify = true;
                        acc.save((err, accM) => {
                            if (err) {
                                return next(err);
                            } else {
                                // account.find({manager: acc._id})
                                // .then((accounts) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({
                                        dateStart: undefined,
                                        dateEnd: undefined,
                                        name: undefined,
                                        message: 'Sẵn sàng tạo khảo sát mới!',
                                        // accounts: accounts,
                                        surveys: surveys
                                    });
                                // }, (err) => next(err))                            
                            }
                        })                    
                    }, (err) => next(err))
                    .catch((err) => next(err))
                } else {
                    acc.modify = false;
                    acc.finish = false;
                    acc.save((err, acc) => {
                        if (err) {
                            return next(err);
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                dateStart: undefined,
                                dateEnd: undefined,
                                name: undefined,
                                message: 'Khảo sát đã kết thúc!' + '\n' + 'Không có cuộc khảo sát nào đang được diễn ra!',
                                accounts: [],
                                surveys: surveys
                            })
                        }
                    })
                }
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
/**
 * gửi thông tin khảo sát mới lên server
 * khảo sát mới bao gồm thông tin về 
 * ngày bắt đầu, ngày kết thúc, tên khảo sát, các tài khoản được cấp quyền
 * tài khoản cấp 1 gửi lên server thông tin về ngày bắt đầu, kết thúc, tên khảo sát, các tài khoản được cấp quyền
 * các tài khoản cấp khác (cấp != 1) chỉ gửi thông tin về những tài khoản đc cấp quyền mà nó quản lý
 * 
 * khảo sát mới chỉ đc tạo khi ko có khảo sát nào đang diễn ra
 */
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.user.level == 1) {
        survey.findOne({dateStart: {$lt: new Date()}, dateEnd: {$gt: new Date()}})
        .then((sur) => {
            if (!sur) {
                survey.create({
                    dateStart: new Date(req.body.dateStart),
                    dateEnd: new Date(req.body.dateEnd),
                    name: req.body.nameSurvey,
                    finish: []
                })
                .then((newSur) => {
                    var arrAccountID = req.body.arrAccountID;
                    var check = true;
                    for (var i = 0; i < arrAccountID.length; i++) {
                        if (arrAccountID[i] < 1 || arrAccountID[i] > 63) {
                            check = false;
                            break;
                        }
                    }
                    if (check) {
                        for (var i = 0; i < arrAccountID.length; i++) {
                            account.findOneAndUpdate({IDCode: arrAccountID[i]}, {$set: {modify: true}}, {new: true}, (err, acc) => {
                                if (err) {
                                    return next(err);
                                }
                            });
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(newSur);
                    } else {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            message: 'Dữ liệu không hợp lệ!'
                        })
                    }
                }, (err) => {
                    next(err)
                })
                .catch((err) => {
                    next(err);
                })
            } else {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    message: 'Khảo sát đang diễn ra!' + '\n' + 'Không thể tạo khảo sát mới'
                })
            }
        }, (err) => {
            next(err);
        })
        .catch((err) => {
            next(err);
        })
    } else {
        if (req.user.modify) {
            var arrAccountID = req.body.arrAccountID;
            var check = true;
            for (var i = 0; i < arrAccountID.length; i++) {
                if (arrAccountID[i] < (req.user.IDCode * 100 + 1) || arrAccountID[i] > (req.user.IDCode * 100 + 99)) {
                    check = false;
                    break;
                }
            }      
            if (check) {      
                for (var i = 0; i < arrAccountID.length; i++) {
                    account.findOneAndUpdate({IDCode: arrAccountID[i]}, {$set: {modify: true}}, {new: true}, (err, acc) => {
                        if (err) {
                            return next(err);
                        }
                    })
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    message: 'Cấp quyền thành công!'
                })
            } else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    message: 'Dữ liệu không hợp lệ!'
                })
            }
        } else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Bạn không được cấp quyền tham gia khảo sát'
            })
        }
    }
})
/**
 * put request
 * chỉnh sửa khảo sát đang diễn ra
 * tài khoản có thể thay đổi các tài khoản cấp dưới nó quản lý tham gia khảo sát 
 */
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyModify, (req, res, next) => {
    var arrAccountID = req.body.arrAccountID;
    var level = req.user.level;
    var check = true;
    if (level == 1) {
        for (var i = 0; i < arrAccountID.length; i++) {
            if (arrAccountID[i] < 1 || arrAccountID[i] > 63) {
                check = false;
                break;
            }
        }
    } else {
        for (var i = 0; i < arrAccountID.length; i++) {
            if (arrAccountID[i] < (req.user.IDCode * 100 + 1) || arrAccountID[i] > (req.user.IDCode * 100 + 99)) {
                check = false;
                break;
            }
        }
    }
    if (check) {
        account.find({manager: req.user._id})
        .then((accounts) => {
            for (var i = 0; i < accounts.length; i++) {
                accounts[i].modify = false;
                accounts[i].save((err) => {
                    if (err) {
                        return next(err);
                    }
                });
            }
            for (var i = 0; i < arrAccountID.length; i++) {
                account.findOneAndUpdate({IDCode: arrAccountID[i]}, {$set: {modify: true}}, {new: true}, (err, acc) => {
                    if (err) {
                        return next(err);
                    }
                })
            }
            level = level + 1;
            while(level < 5) {
                account.find({level: level + 1})
                .populate('manager')
                .then((accs) => {
                    for (var i = 0; i < accs.length; i++) {
                        if (!accs[i].manager.modify) {
                            accs[i].modify = false;
                            accs[i].save((err) => {
                                if (err) {
                                    return next(err);
                                }
                            })
                        }
                    }
                }, (err) => next(err))
                .catch((err) => next(err))
                level++;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Khảo sát đã được cập nhật thành công.'
            })
        })
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            message: 'Dữ liệu không hợp lệ!'
        })
    }
});

createNew.route('/:surveyId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
/**
 * xem thống kê về khảo sát có id là surveyId
 * xem danh sách cấp dưới mà nó quản lý có hoàn thành khảo sát hay chưa
 */
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.params.surveyId[0] = '';
    var id = req.params.surveyId.replace(req.params.surveyId.charAt(0), '');
    survey.findById(id)
    .populate('finish')
    .then((sur) => {
        if (sur) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(sur);
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Không tìm thấy khảo sát phù hợp!'
            })
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    })
})
/**
 * xóa khảo sát diễn ra
 * 
 * id khảo sát được gửi trong req.params
 * chỉ tài khoản cấp 1 được phép xóa khảo sát
 */
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    survey.findByIdAndDelete({_id: req.params.surveyId})
    .then((sur) => {
        if (sur) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(sur);    
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Không tìm thấy khảo sát phù hợp!'
            })
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    })
});

/**
 * submit trạng thái hoàn thành
 *  
 * tài khoản cấp 4, 5 khi submit thì sẽ finish = true;
 * tài khoản cấp 1, 2, 3 submit khi các tài khoản cấp dưới đã hoàn thành thì finish = true;
 * khi submit thành công, thêm tài khoản vào danh sách hoàn thành của survey
 */
createNew.route('/finish')
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyModify, (req, res, next) => {
    account.find({manager: req.user._id})
    .then((accs) => {
        var check = true;
        for (var i = 0; i < accs.length; i++) {
            if (!accs[i].finish) {
                check = false;
            }
        }
        if (check) {
            account.findByIdAndUpdate({_id: req.user._id}, {$set: {finish: true}}, {new: true})
            .then((acc) => {
                survey.findOne({dateStart: {$lt: new Date()}, dateEnd: {$gt: new Date()}})
                .then((sur) => {
                    var ar = sur.finish;
                    if (!ar.includes(acc._id)) {
                        sur.finish.push(acc._id);
                        sur.save((err, sur) => {
                            if (err) {
                                return next(err);
                            } else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({
                                    success: true,
                                    user: acc,
                                    message: 'Bạn đã hoàn thành khảo sát!'
                                });
                            }
                        })
                    }
                }, (err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err))
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                message: 'Bạn chưa hoàn thành khảo sát!'
            })
        }
    })
    .catch((err) => next(err))
});

module.exports = createNew;

