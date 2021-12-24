var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');

var account = require('../models/account');
var authenticate = require('../authenticate');
var Instance = require('../models/instance');
var cors = require('./cors');

var signupRouter = express.Router();

signupRouter.use(bodyParser.json());

/**
 * bổ sung
 * .get('/')
 * trả về danh sách tài khoản mà nó quản lý
 */

signupRouter.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    account.find({manager: req.user._id})
    .then((accs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(accs);
    })
    .catch((err) => next(err));
})
/**
 * tạo tài khoản mới tương ứng với địa phương đã được khai báo
 * nếu chưa khai báo địa phương thì không được phép cấp tài khoản
 * các tài khoản chỉ được phép cấp tài khoản cho cấp ngay dưới mà nó quản lý
 * 
 * có thể bổ sung tự động điền tên ứng với mã khai báo
 */
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyCreateUser, (req, res, next) => {
    Instance.findOne({zipCode: req.body.username})
    .then((ins) => {
        if (!ins) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Bạn chưa khai báo địa phương tương ứng với mã khai báo!'
            })
        } else {
            var check = true;
            if (req.user.level == 1) {
                if (req.body.username < 1 || req.body.username > 63) {
                    check = false;
                }
            } else {
                if (req.body.username < (req.user.IDCode * 100 + 1) || req.body.username > (req.user.IDCode * 100 + 99)) {
                    check = false;
                }
            }
            if (check) {
                account.register(new account({username: req.body.username, 
                                                level: req.user.level + 1, 
                                                name: req.body.name, 
                                                IDCode: req.body.username, manager: req.user._id}), req.body.password, (err, acc) => {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            error: err
                        });
                    }
                    passport.authenticate('local')(req, res, () => {
                        console.log("success");
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true, 
                            status: 'Cấp tài khoản thành công!'
                        })
                    })
                })
            } else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    message: 'Bạn không được phép cấp tài khoản với mã khai báo này!'
                })
            }
        }
    })
});

module.exports = signupRouter;