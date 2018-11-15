var createError = require('http-errors');
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var config = require('./config/db.json');
mongoose.connect(config.remote);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pizzaRouter = require ('./routes/pizza');


var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use(logger('dev'));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pizza',pizzaRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
