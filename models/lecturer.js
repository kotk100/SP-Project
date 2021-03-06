/* jshint indent: 2 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Lecturer = sequelize.define('Lecturer', {
    idLecturer: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'idLecturer'
    },
    lecturerName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'LecturerName'
    }
  }, {
    tableName: 'lecturer',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    classMethods: {
      associate: function(models) {
        Lecturer.hasMany(models.Lecture, { as: 'Lectures', foreignKey: 'idLecturer'})
      }
    }
  });

  return Lecturer;
};
