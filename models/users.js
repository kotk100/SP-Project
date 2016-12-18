/* jshint indent: 2 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    idUser: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: 'uniqueUserId',
      field: 'idUser'
    },
    userName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: 'uniqueUsername',
      field: 'UserName'
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      field: 'Password'
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: 'uniqueUsername',
      field: 'Email'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'Verified'
    }
  }, {
    tableName: 'users',
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Timetable, { as: 'Timetable', foreignKey: 'idUser'});
        User.hasOne(models.Setting, {as: 'Settings', foreignKey: 'idUser'});
      }
    }
  });

  return User;
};
