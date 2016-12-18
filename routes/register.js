var models  = require('../models');
var logger = require('../config/logger.js');
var mailer = require('../config/nodemailer.js');
var express = require('express');
var router  = express.Router();
var bcrypt = require('bcrypt');

//display page
router.get('/', function(req, res){
    res.render('register', { cssFile:'register', layout: 'footer', message: req.session.message });
    req.session.message = null;
});

//verify account
router.get('/verify/:ver', function(req, res){
    models.Verification.findOne({
        where: {
            verificationCode: req.params.ver
        },
        include: [
            { model: models.User, as: 'User' }
        ]
    }).then(function(ver){
        if(ver)
            ver.User.update({
                verified: true
            }).then(function(user){
                logger.debug('User verified');
                ver.destroy();
                req.session.message = 'User verified.';
                req.session.error = false;
                return res.redirect('/message');
            }, function(err) {
                logger.error('Failed getting verification!', err); //TODO tell user
                return res.redirect('/login');
            });
    }, function(err){
        logger.error('Failed getting verification!', err); //TODO tell user
        return res.redirect('/login');
    });
});

//Create verification token and send email for account verification
var sendVerEmail = function(user){
    models.Verification.create({
        idUser: user.idUser,
        verificationCode: user.idUser
    }).then(function(ver){
        logger.debug('Created verification.');
        mailer.sendEmail(user, '<a href="localhost:3000/register/verify/' + ver.idUser + '">localhost:3000/register/verify/' + ver.idUser + '</a>');
    }, function(err){
        logger.error('Error creating verification!', err);
    });
};

//create user
router.post('/', function(req, res) {
    logger.info('Creating user...');

    //check input
    if(!req.body.email || !req.body.username || !req.body.password[0] || !req.body.password[1] || !req.body.terms){
        req.session.message = 'Please fill all inputs.';
        return res.redirect('register');
    }
    var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    if(!re.test(req.body.email)){
        req.session.message = 'Invalid email.';
        return res.redirect('register');
    }
    re = /(?=.{4,20}$)[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]/;
    if(!re.test(req.body.userName)){
        req.session.message = 'Invalid username.';
        return res.redirect('register');
    }
    re = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
    if(!re.test(req.body.password[0]) || req.body.password[0] != req.body.password[1]){
        req.session.message = 'Invalid password.';
        return res.redirect('register');
    }

    //save user
    bcrypt.hash(req.body.password[0], 10).then(function(hash) {
        models.User.create({
            userName: req.body.username,
            email: req.body.email,
            password: hash,
            verified: false
        }).then(function(user) {
            logger.info('Created.');
            sendVerEmail(user);
            req.session.message = 'User created. You will recieve a confirmation e-mail.';
            req.session.error = false;
            return res.redirect('/message');
        }, function(err){
            logger.error('Error creating user', err);
            req.session.message = 'User with the specified username or email already exsists!';
            req.session.error = true;
            return res.redirect('/message');
        });
    });
});

module.exports = router;