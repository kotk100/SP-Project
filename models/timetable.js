/* jshint indent: 2 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Timetable = sequelize.define('Timetable', {
    idUser: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'idUser'
      },
      field: 'idUser'
    },
    idLecture: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'lectures',
        key: 'idLecture'
      },
      field: 'idLecture'
    },
    idLectureExchange: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'idLectureExchange'
    },
  }, {
    tableName: 'timetable',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    classMethods: {
      associate: function(models) {
        Timetable.belongsTo(models.User, { as: 'User', foreignKey: 'idUser'});
        Timetable.belongsTo(models.Lecture, { as: 'Lecture', foreignKey: 'idLecture'});
      }
    }
  });

  return Timetable;
};
