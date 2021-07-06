var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
var crypto = require('crypto');

const connection = require('./Config/database');

const MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const User = require('./models/User');


/**
 * --------------- GENERAL - SET-UP -------------------
 */
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config()
// Create the Express application
var app = express();


// /**
//  * ---------- SET-UP - MONGODB ---------------
//  */
// // var mongoDB =  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.fykun.mongodb.net/inventory_db?retryWrites=true&w=majority`
// mongoose.connect(process.env.DB_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/**
 * ----------------------- SESSION SETUP ----------------------------
 */
/**
 * The MongoStore is used to store session data.
 * 
 * Note that the `connection` used for the MongoStore is the same connection that we are using above
 */

// const sessionStore = new MongoStore({
//   mongooseConnection: connection,
//   collection: 'sessions'
// });
/**
 * secret: This is a random string that will be used to "authenticate" the session.  In a production environment,
 * you would want to set this to a long, randomly generated string
 * 
 * resave: when set to true, this will force the session to save even if nothing changed.  If you don't set this, 
 * the app will still run but you will get a warning in the terminal
 * 
 * saveUninitialized: Similar to resave, when set true, this forces the session to be saved even if it is unitialized
 */
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_STRING,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));

// -----------------------SESSION SETUP - END--------------------------------------


// ---------------- PASSPORT START ------------------------------


require('./Config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});


// --------------------------- END PASSPORT ------------------------

// ------------------- ROUTES --------------------------------

app.use('/', indexRouter);
app.use('/users', usersRouter);


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
  res.render('error');
});

module.exports = app;