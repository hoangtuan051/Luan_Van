var express = require('express');
var passport = require('passport');
var router = express.Router();

// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', function(req, res) {
	res.render('sentence'); // load the index.ejs file
});

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('login', { message: req.flash('loginMessage') });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
	}), function(req, res) {
    console.log("hello");

    if (req.body.remember) {
      req.session.maxAge = 1000 * 60 * 3;
    } else {
      req.session.expires = false;
    }

    res.redirect('/profile');
});

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/logup', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('logup', { message: req.flash('signupMessage') });
});

// process the signup form
router.post('/logup', passport.authenticate('local-signup', {
	successRedirect : '/profile', // redirect to the secure profile section
	failureRedirect : '/logup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile', {
		user : req.user // get the user out of session and pass to template
	});
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}