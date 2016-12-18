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
      allowNull: false,
      field: 'CarSelected'
    },
    busSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'BusSelected'
    },
    bicycleSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'BicycleSelected'
    },
    pedSelected: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'PedSelected'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'Address'
    },
    preparationTime: {
      type: "DOUBLE",
      allowNull: false,
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
    classMethods: {
      associate: function(models) {
        Setting.belongsTo(models.User, { as: 'user', foreignKey: 'idUser'});
      }
    }
  });

  return Setting;
};
