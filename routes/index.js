var models  = require('../models');
var express = require('express');
var logger = require('../config/logger');
var router  = express.Router();

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
        return res.render('index', { cssFile: 'main', data: result});
    }, function(err){
        logger.error('Error fetching lectures for user', err);
        return res.render('index', { cssFile: 'main'});
    });
});

router.get('/about', function(req, res){
    return res.render('about', {layout: 'footer', cssFile: 'register'});
});

module.exports = router;