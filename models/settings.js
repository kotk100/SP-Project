/* jshint indent: 2 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Setting = sequelize.define('Setting', {
    idUser: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'idUser'
      },
      field: 'idUser'
    },
    carSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'CarSelected'
    },
    busSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'BusSelected'
    },
    bicycleSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'BicycleSelected'
    },
    pedSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'PedSelected'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'Address'
    },
    preparationTime: {
      type: "DOUBLE",
      allowNull: true,
      field: 'PreparationTime'
    },
    studentId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'StudentId'
    },
    weather: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'Weather'
    }
  }, {
    tableName: 'settings',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    classMethods: {
      associate: function(models) {
        Setting.belongsTo(models.User, { as: 'user', foreignKey: 'idUser'});
      }
    }
  });

  return Setting;
};
