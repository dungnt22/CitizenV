var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var config = require('./config');

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var signupRouter = require('./routes/signup');
var surveyRouter = require('./routes/createSurvey');
var uploadRouter = require('./routes/upload');
var searchRouter = require('./routes/search');
var declareRouter = require('./routes/declare');

const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {
  console.log(err);
})

var app = express();
// app.all('*', (req, res, next) => {
//   if (req.secure) {
//     return next()
//   } else {
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   }
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', accountRouter);
app.use('/signup', signupRouter);
app.use('/survey', surveyRouter);
app.use('/upload', uploadRouter);
app.use('/search', searchRouter);
app.use('/declare', declareRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
