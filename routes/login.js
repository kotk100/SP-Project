var models  = require('../models');
var logger = require('../config/logger.js');
var passport = require('passport');
var express = require('express');
var router  = express.Router();

//Display login page
router.get('/', function(req, res){
    res.render('login', {layout: 'footer', cssFile: 'login', message: req.session.message, lang: req.locale});
    req.session.message = null;
});

//Try to login, if successful redirect to home page
router.post('/',  function(req, res, next) {

    // generate the authenticate method and pass the req/res
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.session.message = req.__('invUser');
            return res.redirect('/' + req.locale +'/login');
        }

        // req / res held in closure
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/' + req.locale);
        });

    })(req, res, next);

});

//logout user
router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/' + req.locale + '/login');
});

module.exports = router;