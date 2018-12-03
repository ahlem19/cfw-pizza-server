var createError = require('http-errors');
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var config = require('./config/db.json');
var cors = require('cors');
mongoose.connect(config.remote, { useNewUrlParser: true });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pizzaRouter = require('./routes/pizza');
var pictureRouter = require('./routes/picture');
var authRouter = require('./routes/auth');


var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.use(logger('dev'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/pizza', pizzaRouter);
app.use('/uploads', pictureRouter);

app.use('/ressources/pizza-pictures', express.static(path.join(__dirname, 'ressources/pizza-pictures')));
app.use(express.static(path.join(__dirname, 'public')));





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
    res.send(err);
});

module.exports = app;