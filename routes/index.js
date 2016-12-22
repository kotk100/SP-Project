var models  = require('../models');
var express = require('express');
var logger = require('../config/logger');
var request = require('request');
var router  = express.Router();

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyC5J1K5IW4ICEMTh7I6m2w2rQJJrEzzW2s'
});

var numPadding = function(num){
    return ("0" + num).slice(-2);
};

router.get('/', function(req, res) {
    models.Timetable.findAll({
        where: {
            idUser: req.user
        },
        include: [{
            model: models.Lecture,
            as: 'Lecture',
            include: [
                {
                    model: models.Lecturer,
                    as: 'Lecturer'
                },
                {
                    model: models.Subject,
                    as: 'Subject'
                }
            ]
        }],
        order: [
            [ { model: models.Lecture, as: 'Lecture' }, 'day', 'ASC' ],
            [ { model: models.Lecture, as: 'Lecture' }, 'startTime', 'ASC' ]
        ]
    }).then(function(result){
        logger.debug('fetched lectures for user');
        models.Setting.findOne({
            where: {
                idUser: req.user
            }
        }).then(function(settings){
            if(!settings.address || settings.address == ''){
                req.session.message = req.__('missingAddres');
                res.redirect('/' + req.locale + '/settings');
            } else {
                request('http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/299198?apikey=jpFSYRkIHseWhOhyMlGLaFDGNkHyHFaK&metric=true HTTP/1.1', function (error, response, body) {
                    if(error || response.statusCode != 200){
                        logger.error('Error fetching settings for user', error);
                        return res.render('index', { cssFile: 'main', lang: req.locale, message: req.__('wheaterUnav'), data: result});
                    }

                    var transportation;
                    if(JSON.parse(response.body).PrecipitationProbability > 49){
                        transportation = settings.carSelected ? 'driving' : settings.busSelected ? 'transit' : settings.pedSelected ? 'walking' : 'bicycling';
                    } else {
                        transportation = settings.pedSelected ? 'walking' : settings.bicycleSelected ? 'bicycling' : settings.carSelected ? 'driving' : 'transit';
                    }
                    var d = new Date();

                    result.some(function(lec){
                        var start = parseInt(lec.Lecture.startTime.substring(0,2));
                        if(d.getDay() == 5 || d.getDay() == 0 || lec.Lecture.day == d.getDay() || (lec.Lecture.day+1 == d.getDay() && start > d.getHours()+2)){
                            d.setDate(d.getDate() + ((lec.Lecture.day+1)%7 - d.getDay()));
                            d.setHours(start, 0, 0, 0);
                            return true;
                        }
                    });

                    if(d.getTime() == new Date().getTime()){
                        logger.debug('No courses were avaible', result);
                        return res.render('index', { cssFile: 'main', lang: req.locale, message: req.__('noCourse'), data: result});
                    }

                    googleMapsClient.directions({
                        origin: settings.address,
                        destination: '46.050736, 14.468832',
                        mode: transportation,
                        arrival_time: Math.round(d.getTime() / 1000)
                    }, function (err, response) {
                        if (!err) {
                            if(response.json.routes.length < 1){
                                logger.error('Error fetching directions', err);
                                return res.render('index', { cssFile: 'main', lang: req.locale, message: req.__('dirUnav'), data: result});
                            }
                            if(transportation == 'transit') {
                                d = new Date(response.json.routes[0].legs[0].departure_time.value * 1000);
                            } else {
                                d = new Date(d.getTime() - response.json.routes[0].legs[0].duration.value * 1000);
                            }
                            var dwake = new Date(d.getTime() - Math.round(settings.preparationTime * 60000));
                            return res.render('index', {
                                cssFile: 'main',
                                data: result,
                                leave: numPadding(d.getHours()) + ':' + numPadding(d.getMinutes()),
                                wake: numPadding(dwake.getHours()) + ':' + numPadding(dwake.getMinutes()),
                                transport: transportation,
                                lang: req.locale
                            });
                        } else {
                            logger.error('Error fetching directions', err);
                            return res.render('index', { cssFile: 'main', lang: req.locale, message: req.__('datUnav'), data: result});
                        }
                    });
                });

            }
        }, function(err){
            logger.error('Error fetching settings for user', err);
            return res.render('index', { cssFile: 'main', lang: req.locale});
        });
    }, function(err){
        logger.error('Error fetching lectures for user', err);
        return res.render('index', { cssFile: 'main', lang: req.locale});
    });
});

module.exports = router;