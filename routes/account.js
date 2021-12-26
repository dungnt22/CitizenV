var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var authenticate = require('../authenticate');
var account = require('../models/account');
var cors = require('./cors');

var router = express.Router();

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * login
 * by default
 * if authentication fails, Passport will response with 401 Unauthorized status
 */
router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: false,
        status: 'Đăng nhập không thành công!',
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false,
          status: 'Đăng nhập không thành công!',
          err: 'Không thể đăng nhập!'
        });
      }

      var token = authenticate.getToken({_id: req.user._id});
      account.findById({_id: req.user._id})
      .then((acc) => {
        console.log(acc);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true, 
          status: 'Đăng nhập thành công!', 
          token: token,
          user: acc
        });      
      }, (err) => next(err))
      .catch((err) => next(err))
    })
  }) (req, res, next);
});

/**
 * logout
 * redirect('/')
 */
router.get('/logout', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

/**
 * updateAccount
 */
router.put('/updateAccount', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  if (req.body.username != null || req.body.passport != null) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      message: 'Dữ liệu không hợp lệ'
    })
  }
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

/**
 * changePassword
 */
router.put('/changePassword', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  account.findById({_id: req.user._id})
  .then((acc) => {
    acc.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
      if (err) {
        next(err)
      } else {
        res.json({
          success: true,
          message: 'Your password has been changed successfully!'
        });
      }
    })
  }, (err) => {
    next(err);
  })
  .catch((err) => {
    next(err);
  })
});


/**
 * forgotPassword
 */
router.post('/forgotPassword', cors.corsWithOptions, (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      next(err)
    } else {
      var token = buf.toString('hex');
      account.findOneAndUpdate(
        {username: req.body.username},
        {$set: {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000
        }
        },
        {new: true} 
      )
      .then((acc) => {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          type: 'SMTP',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'citizenVmail@gmail.com',
            pass: 'nguyenthidung'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          to: acc.email,
          from: 'citizenVmail@gmail.com',
          subject: 'CitizenV Reset Password',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            // req.flash('error', 'Lỗi gửi mail: ' + err)
            res.redirect('/users/forgotPassword');
          } else {
            // req.flash('info', 'An e-mail has been send to ' + acc.email)
            console.log('An e-mail has been send to ' + acc.email)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              message: 'An e-mail has been send to ' + acc.email
            })
          }
        });
      }, (err) => {
        next(err)
      })
      .catch((err) => next(err))
    }
  })
});

/**
 * reset
 * verify if token is valid?
 */
router.get('/reset/:token', cors.cors, (req, res, next) => {
  account.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, acc) => {
    if (!acc) {
      // req.flash('error', 'Password reset token is invalid or has expired.');
      res.redirect('/users/forgotPassword');
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'OK'})
    }
  })

});

/**
 * reset Password
 */
router.post('/reset/:token', cors.corsWithOptions, (req, res, next) => {
  account.findOneAndUpdate(
    {resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}},
    {$set: {
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    }},
    {new: true}
  )
  .then((acc) => {
    acc.setPassword(req.body.password, (err, acc) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false,
          message: 'Password cound not be saved!' + '\nPlease try again!'
        })
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Your new Password has been saved successfully'
        })
        res.redirect('/users/login');
      }
    })
  }, (err) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.json('Password reset token is invalid or has expired.')
    res.redirect('/users/forgotPassword')
  })
  .catch((err) => next(err));
})

/**
 * tạo thêm 1 endpoint cho cấp lại mật khẩu
 * /forgotPassword
 *  
 */

/**
 * tạo một route riêng cho /my
 * trong route /my 
 * gồm updateAccount
 * updatePassword
 */

module.exports = router;
// https://github.com/hardillb/2FA-Demo/blob/f268e76c686c20706c904c722e7b545d078b9c62/index.js#L125