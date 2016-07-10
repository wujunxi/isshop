var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var loginFilter = require('./filter/login-filter'),
    routes = require('./routes/index'),
    login = require('./routes/login'),
    logout = require('./routes/logout'),
    users = require('./routes/users');

var $conf = require('./conf');
var Dao = require('./dao/Dao');

var app = express();


// get environment variable
// windows : set NODE_ENV=test
//           echo %NODE_ENV%
// linux : export NODE_ENV=test
//         echo $NODE_ENV
var env = app.get('env');
console.log('current environment is ' + env);
if(env === 'development'){
    $conf.env ='dev';
}else if(env == 'test'){
    $conf.env = 'test';
}else{
    $conf.env = 'pro';
}

// create connect pool
Dao.pool = mysql.createPool(Object.assign({}, $conf.mysql));

// session
app.use(session($conf.session));

// view engine setup
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger($conf.log));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// routes
app.use('/', routes);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', loginFilter, users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (env === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;