var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var parse = require('./routes/parse');
var mysql = require('mysql');
var connection = require("express-myconnection");
var session = require("express-session");
var flash = require("express-flash");

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
require('./config/passport.js')(Passport);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src')));
app.use('/users', express.static(path.join(__dirname, 'src')));
app.use(session({
	secret: 'hoangtuannn',
	resave: true,
	saveUninitialized: true
 })); // session secret
app.use(Passport.initialize());
app.use(Passport.session());
app.use(flash());
//passport.authenticate('session');
app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/sentences', parse);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
