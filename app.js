const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRouter = require("./src/routes/user/router.js");
// const messageRouter = require("./src/routes/messages/main.js");
const tokenRouter = require("./src/routes/token/router");
const keepAliveRouter = require("./src/routes/keep alive/keep_alive.js");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/keep_alive', keepAliveRouter);

app.use('/token', tokenRouter);

// app.use('/message/', messageRouter);
app.use('/user', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack); // print stack trace to console

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ "Error": + err.message });
});

module.exports = app;
