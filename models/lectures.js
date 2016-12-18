/* jshint indent: 2 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Lecture = sequelize.define('Lecture', {
    idLecture: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'idLecture'
    },
    idSubject: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'idSubject'
      },
      field: 'idSubject'
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'StartTime'
    },
    duration: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      field: 'Duration'
    },
    day: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'Day'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'Location'
    },
    practical: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'Practical'
    },
    idLecturer: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'lecturer',
        key: 'idLecturer'
      },
      field: 'idLecturer'
    }
  }, {
    tableName: 'lectures',
    classMethods: {
      associate: function(models) {
        Lecture.hasMany(models.Timetable, { as: 'Timetables', foreignKey: 'idLecture'});
        Lecture.belongsTo(models.Lecturer, { as: 'Lecturer', foreignKey: 'idLecturer'});
        Lecture.belongsTo(models.Subject, { as: 'Subject', foreignKey: 'idSubject'})
      }
    }
  });

  return Lecture;
};
