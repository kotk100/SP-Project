var osmosis = require('osmosis');
var models = require('../models');
var logger = require('../config/logger');

var getDayId = function(str){
    switch(str){
        case 'MON':
            return 0;
        case 'TUE':
            return 1;
        case 'WED':
            return 2;
        case 'THU':
            return 3;
        case 'FRI':
            return 4;
    }
};

var saveCourse = function(course, userId){
    course.day = getDayId(course.day.substring(0, 3));
    course.lecturer = course.lecturer ? course.lecturer.constructor === Array ? course.lecturer[0] : course.lecturer : '';

    var name = course.courseName.split('_');
    course.practical = name[1] == 'LV' ||  name[1] == 'AV';

    models.Lecturer.findOne({
        where: {lecturerName: course.lecturer}
    }).then(function (lecturer) {
            models.Subject.findOne({
                where: {
                    subjectName: name[0]
                }
            }).then(function (subject) {
                    models.Lecture.findOne({
                        where: {
                            idSubject: subject.idSubject,
                            startTime: course.time + ':00',
                            duration: course.duration,
                            day: course.day,
                            location: course.location,
                            practical: course.practical,
                            idLecturer: lecturer.idLecturer
                        }
                    }).then(function (lecture) {
                            models.Timetable.findOrCreate({
                                where: {
                                    idUser: userId,
                                    idLecture: lecture.idLecture
                                },
                                defaults: {
                                    idUser: userId,
                                    idLecture: lecture.idLecture
                                }
                            }).then(function (timetable, created) {
                                logger.debug('Timetable created');
                            }, function (err) {
                                logger.error('Error lecture', err);
                            });
                    }, function (err) {
                        logger.error('Error lecture', err);
                    });
            }, function (err) {
                logger.error('Error subject', err);
            });
    }, function (err) {
        logger.error('Error lecturer', err);
    });
};

module.exports = { getData: function(studentId, userId){
    osmosis
        .get('https://urnik.fri.uni-lj.si/timetable/fri-2016_2017-zimski-drugi-teden/allocations?student='+studentId)
        .find('tr')
        .set({
            'time': 'td:first:html',
            'other': osmosis.select('td:has(div)').set({
                'day': '@class',
                'courseName': 'a.activity:html',
                'location': 'a.classroom:html',
                'lecturer': 'a.teacher:html',
                'duration': '@rowspan'
            })
        })
        .data(function(courses) {
            if(courses.other.day) {
                courses.other.time = courses.time;
                saveCourse(courses.other, userId);
            } else if (courses.other.constructor === Array){
                courses.other.forEach(function(course){
                    course.time = courses.time;
                    saveCourse(course, userId);
                });
            }
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log);
}};