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

var saveCourse = function(course){
    course.day = getDayId(course.day.substring(0, 3));
    course.lecturer = course.lecturer ? course.lecturer.constructor === Array ? course.lecturer[0] : course.lecturer : '';

    var name = course.courseName.split('_');
    course.practical = name[1] == 'LV' ||  name[1] == 'AV';

    models.Lecturer.findOrCreate({
        where: {lecturerName: course.lecturer},
        defaults: {lecturerName: course.lecturer}
    }).then(function (lecturer, created) {
        models.Subject.findOrCreate({
            where: {
                longName: course.longName
            },
            defaults: {
                idSubject: course.courseId,
                subjectName: name[0],
                longName: course.longName
            }
        }).then(function (subject, created) {
            models.Lecture.findOrCreate({
                where: {
                    idSubject: subject[0].idSubject,
                    startTime: course.time + ':00',
                    duration: course.duration,
                    day: course.day,
                    location: course.location,
                    practical: course.practical,
                    idLecturer: lecturer[0].idLecturer
                },
                defaults: {
                    idSubject: subject[0].idSubject,
                    startTime: new Date('January 01, 1970 ' + course.time + ':00 UTC'),
                    duration: course.duration,
                    day: course.day,
                    location: course.location,
                    practical: course.practical,
                    idLecturer: lecturer[0].idLecturer
                }
            }).then(function (lecture, created) {
                console.log('created lecture');
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

module.exports = { getData: function(){
    osmosis
        .get('https://urnik.fri.uni-lj.si/timetable/fri-2016_2017-zimski-drugi-teden/')
        .find('//td[4]/div/a')
        .set({
            'course': './text()',
            'details': osmosis.follow('./@href')
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
        })
        .data(function(courses) {
            var cDet = courses.course.trim(')').split('(');
            courses.details.forEach(function(el){
                if(el.other.day) {
                    el.other.time = el.time;
                    el.other.longName = cDet[0];
                    el.other.courseId = cDet[cDet.length - 1].substring(0,cDet[cDet.length - 1].length - 1);
                    saveCourse(el.other);
                } else if (el.other.constructor === Array){
                    el.other.forEach(function(course){
                        course.time = el.time;
                        course.longName = cDet[0];
                        course.courseId = cDet[cDet.length - 1];
                        saveCourse(course);
                    });
                }
            });
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log);
}};