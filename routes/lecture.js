var models  = require('../models');
var logger = require('../config/logger');
var express = require('express');
var mailer = require('../config/nodemailer');
var router  = express.Router();

//Delete lecture
router.delete('/:lectureId',  function(req, res) {
    models.Timetable.findOne({
        where: {
            idUser: req.user,
            idLecture:  req.params.lectureId
        }
    }).then(function(lecture){
        lecture.destroy();
        logger.debug('Lecture deleted');
        res.status(204);
        res.send('Done');
    }, function(err){
        logger.error('Lecture deletion failed', err);
        res.status(500);
        res.send('Failed');
    });
});

//Return subjects
router.get('/', function(req, res){
    models.Subject.findAll({
        raw: true
    }).then(function(subjects){
        res.json(subjects);
    }, function(err){
        logger.error('Fetching subjects failed', err);
        res.status(500);
        res.send('Failed');
    });
});

//Return lectures for subject
router.get('/:subjectId', function(req, res){
    models.Lecture.findAll({
        where: {
            idSubject: req.params.subjectId
        },
        include: [
            {
                model: models.Lecturer,
                as: 'Lecturer'
            },
            {
                model: models.Subject,
                as: 'Subject'
            }
        ],
        order: [
            [ 'day', 'ASC' ],
            ['startTime', 'ASC' ]
        ],
        raw:true
    }).then(function(lectures){
        res.json(lectures);
    }, function(err){
        logger.error('Fetching subjects failed', err);
        res.status(500);
        res.send('Failed');
    });
});

var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
var sendExchangeEmails = function(user1, idLecture1, user2, idLecture2){
    models.Lecture.findAll({
        where: {
            $or: [
                { idLecture: idLecture1 },
                { idLecture: idLecture2 }
            ]
        },
        include: [
            {
                model: models.Subject,
                as: 'Subject'
            }
        ]
    }).then(function(lectures){
        models.User.findAll({
            where: {
                $or: [
                    {idUser: user1},
                    {idUser: user2}
                ]
            }
        }).then(function(users){
            if(users[0].idUser != user1){
                var u = users[0];
                users[0] = users[1];
                users[1] = u;
            }
            if(lectures[0].idLecture != idLecture1){
                var l = lectures[0];
                lectures[0] = lectures[1];
                lectures[1] = l;
            }

            mailer.sendEmail(users[0], 'An exchange for your lesson '+ lectures[0].Subject.longName +' at '+ lectures[0].startTime + ' on ' + days[lectures[0].day] + ' was found. Please contact user ' + users[1].userName + ' with email ' + users[1].email + ' and make an agreement on when to exchange your lessons.');
            mailer.sendEmail(users[1], 'An exchange for your lesson '+ lectures[1].Subject.longName +' at '+ lectures[1].startTime + ' on ' + days[lectures[1].day] + ' was found. Please contact user ' + users[0].userName + ' with email ' + users[0].email + ' and make an agreement on when to exchange your lessons.');
        }, function(err){
            logger.error('Fetching users failed', err);
        });
    }, function(err){
        logger.error('Fetching lectures failed', err);
    });
};

//Make an exchange
router.post('/exchange/:idL1/:idL2', function(req, res){
    return models.sequelize.transaction(function(t){
        return models.Timetable.findOne({
            where: {
                idLecture: req.params.idL1,
                idLectureExchange: req.params.idL2
            }
        }, {transaction: t}).then(function(timetable){
            //exchange found, send emails
            if(timetable){
                return timetable.update({
                    idLectureExchange: null
                }, {transaction: t}).then(function(ok){
                    return sendExchangeEmails(timetable.idUser, req.params.idL1, req.user, req.params.idL2);
                }, function(err){
                    logger.error('Timetable update failed', { err: err, idLecture: req.params.idL1, idLecture2: req.params.idL2});
                });
            } else {
                return models.Timetable.findOne({
                    where: {
                        idUser: req.user,
                        idLecture: req.params.idL2
                    }
                }, {transaction: t}).then(function(timetable){
                    return timetable.update({
                        idLectureExchange: req.params.idL1
                    }, {transaction: t}).then(function(ok){
                    }, function(err){
                        logger.error('Timetable update failed', {err: err, idUser: req.user });
                    });
                }, function(err){
                    logger.error('Fetching timetable failed', err);
                });
            }
        }, function(err){
            logger.error('Fetching exchange failed', err);
        });
    }).then(function(ok){
        res.status(200);
        res.send('Done');
    }, function(err){
        res.status(500);
        res.send('Failed');
    });
});

//Add a lecture
router.post('/add/:idLecture', function(req, res){
   models.Timetable.findOrCreate({
       where: {
           idUser: req.user,
           idLecture: req.params.idLecture
       },
       defaults: {
           idUser: req.user,
           idLecture: req.params.idLecture
       }
   }).then(function(lectures){
       res.status(200);
       res.send('Done');
   }, function(err){
       logger.error('Fetching subjects failed', err);
       res.status(500);
       res.send('Failed');
   });
});

module.exports = router;