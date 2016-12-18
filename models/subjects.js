/* jshint indent: 2 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Subject = sequelize.define('Subject', {
    idSubject: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'idSubject'
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'SubjectName'
    },
    longName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'SubjectNameLong'
    }
  }, {
    tableName: 'subjects',
    classMethods: {
      associate: function(models) {
        Subject.hasMany(models.Lecture, { as: 'Lectures', foreignKey: 'idSubject'})
      }
    }
  });

  return Subject;
};
