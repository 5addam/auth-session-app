const passport = require("passport");
const genPassword = require('../Utils/PasswordUtils').genPassword;
const User = require('../models/User');


// index
exports.index = (req, res) => {
    res.render('index', {
        title: 'Home page'
    });
};

// checks user authentication
exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({
            msg: 'You are not authorized to view this resource'
        });
    }
};

// checks if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({
            msg: 'You are not authorized ti view this resource because you are not an admin.'
        });
    }
};

// GET login req
exports.login_get = function (req, res, next) {
    res.render('login', {
        title: ' Login Page'
    });
};

// Handle login POST req

exports.login_post = passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success'
});

// GET register req
exports.register_get = function (req, res, next) {
    res.render('register', {
        title: ' Registration Page'
    });
};

// Handle register POST req
exports.register_post = (req, res, next) => {
    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        hash: hash,
        salt: salt,
        admin: false
    });

    newUser.save(function (err) {
        if (err) {
            return next(err);
        }
        // success
        res.redirect('/login');
    });
};

// protected route GET
exports.protected_route_get = (req, res, next) => {
    res.send('You made it to the protected route.');
};


// admin routet GET
exports.admin_route_get = (req, res) => {
    res.send('You made it to the admin route.');
};

// handle user's logout
exports.logout = (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
};

// login success
exports.login_success = (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
};

// login failure
exports.login_failure = (req, res, next) => {
    res.send('You entered the wrong password.');
};