var models  = require('../models');
var logger = require('../config/logger.js');
var express = require('express');
var router  = express.Router();
var ttLoader = require('./getTimetableById');
var bcrypt = require('bcrypt');
var sequelize = require("sequelize");

router.get('/', function(req, res){
    models.User.findOne({
        where: {
            idUser: req.user
        },
        include: [{
            model: models.Setting,
            as: 'Settings'
        }]
    }).then(function(user){
        if(user) {
            return res.render('settings', {
                cssFile: 'settings',
                user: user,
                message: req.session.message,
                settingsSite: true,
                lang: req.locale
            });
            req.session.message = null;
        } else {
            logger.error('Did not find user!');
            return res.redirect('/' + req.locale + '/');
        }
    }, function(err){
        logger.error('Failed getting user and settings', err);
        return res.redirect('/' + req.locale + '/');
    });
});


//Check input and save settings
router.post('/', function(req, res){
    var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    var re2 = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
    if(req.body.time == null || !(req.body.time > 0) || req.body.address == null || !req.body.email || !re.test(req.body.email) || req.body.password == null || (req.body.password != '' && !re2.test(req.body.password))){
        ttLoader.getData(req.params.StudentId, req.user);
        req.session.message = req.__('invInput');
        return res.redirect('/' + req.locale + '/settings');
    }

    //Start transaction to save setting
    return models.sequelize.transaction(function(t){
        return models.User.findOne({
            where: {
                idUser: req.user
            },
            include: [{
                model: models.Setting,
                as: 'Settings'
            }]
        }, { transaction: t }).then(function(user){
            if(!user){
                logger.error('Did not find user!');
                return;
            }

            req.body.password = req.body.password ? req.body.password : '';

            return bcrypt.hash(req.body.password, 10).then(function(hash){
                return user.update({
                    email: req.body.email,
                    password: req.body.password == '' ? user.password : hash
                }, {transaction: t}).then(function(updated){
                    return user.Settings.update({
                        carSelected: req.body.vehicle1 != null,
                        busSelected: req.body.vehicle2 != null,
                        bicycleSelected: req.body.vehicle3 != null,
                        pedSelected: req.body.vehicle4 != null,
                        address: req.body.address,
                        preparationTime: req.body.time
                    }).then(function(updated){
                        logger.debug('Saving settings finished');
                    }, function(err){
                        logger.error('Failed updating settings', err);
                    });
                }, function(err){
                    logger.error('Failed updating user', err);
                });
            }, function(err){
                logger.error('Failed hashing password', err);
            });
        }, function(err){
            logger.error('Failed getting user and settings', err);
        });
    }).then(function(ok){
        return res.redirect('/' + req.locale + '/settings');
    }, function(err){
        return res.redirect('/' + req.locale + '/settings');
    });
});

router.post('/import', function(req, res){
    var reg = /^63[0-9][0-9][0-9][0-9][0-9][0-9]$/;
    if(req.body.StudentId && reg.test(req.body.StudentId)){
        ttLoader.getData(req.body.StudentId, req.user);
        req.session.message = req.__('impTt');
        req.session.error = false;
        return res.redirect('/' + req.locale + '/message');
    }
    req.session.message = req.__('invStId');
    return res.redirect('/' + req.locale + '/settings');
});

module.exports = router;