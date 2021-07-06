var express = require('express');
var router = express.Router();

const auth_controller = require('../Controllers/auth_controller');
const passport = require('passport');


/**
 * ------------------------- POST ROUTES ------------------------------------------
 */

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login-failure',
  successRedirect: 'login-success'
}));

router.post('/register', auth_controller.register_post);


/**
 * ------------------------- GET ROUTES ------------------------------------------
 */

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    user: req.user
  });
});

/* GET Login - Page */
router.get('/login', auth_controller.login_get);

/* GET Registration - Page */
router.get('/register', auth_controller.register_get);


/* Protected Route - Authentication */
router.get('/protected-route', auth_controller.isAuth, auth_controller.protected_route_get);


/* Admin Route - Authentication */
router.get('/admin-route', auth_controller.isAdmin, auth_controller.admin_route_get);

router.get('/login-failure', auth_controller.login_failure);
router.get('/login-success', auth_controller.login_success);

/* User Log-out route */
router.get('/logout', auth_controller.logout);


module.exports = router;