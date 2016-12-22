var models  = require('../models');
var logger = require('../config/logger.js');
var mailer = require('../config/nodemailer.js');
var express = require('express');
var router  = express.Router();
var bcrypt = require('bcrypt');

//display page
router.get('/', function(req, res){
    res.render('register', { cssFile:'register', layout: 'footer', message: req.session.message, lang: req.locale });
    req.session.message = null;
});

//verify account
router.get('/verify/:ver', function(req, res){
    return models.sequelize.transaction(function(t){
        return models.Verification.findOne({
            where: {
                verificationCode: req.params.ver
            },
            include: [
                { model: models.User, as: 'User' }
            ]
        }, {transaction: t}).then(function(ver){
            if(ver)
                return ver.User.update({
                    verified: true
                }, {transaction: t}).then(function(user){
                    return ver.destroy({transaction: t}).then(function(user){
                        logger.debug('User verified');
                    }, function(err) {
                        logger.error('Failed destroying verification!', err);
                    });
                }, function(err) {
                    logger.error('Failed getting verification!', err);
                });
        }, function(err){
            logger.error('Failed getting verification!', err);
        });
    }).then(function(ok){
        req.session.message = req.__('verUser');
        req.session.error = false;
        return res.redirect('/' + req.locale + '/message');
    }, function(err){
        res.sesion.message = req.__('verFUser');
        req.session.error = true;
        return res.redirect('/' + req.locale + '/message');
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
        req.session.message = req.__('emptInput');
        return res.redirect('/' + req.locale + 'register');
    }
    var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    if(!re.test(req.body.email)){
        req.session.message = req.__('invEmail');
        return res.redirect('/' + req.locale + 'register');
    }
    re = /(?=.{4,20}$)[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]/;
    if(!re.test(req.body.userName)){
        req.session.message = req.__('invUsername');
        return res.redirect('/' + req.locale + 'register');
    }
    re = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
    if(!re.test(req.body.password[0]) || req.body.password[0] != req.body.password[1]){
        req.session.message = req.__('invPass');
        return res.redirect('/' + req.locale + 'register');
    }

    //save user
    bcrypt.hash(req.body.password[0], 10).then(function(hash) {
        return models.sequelize.transaction(function(t){
            return models.User.create({
                userName: req.body.username,
                email: req.body.email,
                password: hash,
                verified: false
            }, {transaction: t}).then(function(user) {
                if(user)
                    return models.Setting.create({
                        idUser: user.idUser
                    }, {transaction: t}).then(function(setting){
                        logger.info('Created.');
                        sendVerEmail(user);
                        req.session.message = req.__('creUser');
                        req.session.error = false;
                    }, function(err){
                        logger.error('Error creating settings!', err);
                        req.session.message = req.__('errUser');
                        req.session.error = true;
                    });
                logger.error('Error creating settings!', err);
                req.session.message = req.__('errUser');
                req.session.error = true;
            }, function(err){
                logger.error('Error creating user', err);
                req.session.message = req.__('exUser');
                req.session.error = true;
            });
        });
    }).then(function(ok){
        return res.redirect('/' + req.locale + '/message');
    }, function(err){
        return res.redirect('/' + req.locale + '/message');
    });
});

module.exports = router;