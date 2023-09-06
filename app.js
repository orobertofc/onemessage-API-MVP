const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRouter = require("./src/routes/user/router.js");
// const messageRouter = require("./src/routes/messages/main.js");
const tokenRouter = require("./src/routes/token/router");
const keepAliveRouter = require("./src/routes/keep alive/keep_alive.js");


const app = express();

function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors);

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

  res.status(404);
});

module.exports = app;
