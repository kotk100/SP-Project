"use strict";

module.exports = function(sequelize, DataTypes) {
    var Verification = sequelize.define('Verification', {
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
        verificationCode: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'verificationcode'
        }
    }, {
        tableName: 'verification',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            associate: function(models) {
                Verification.belongsTo(models.User, { as: 'User', foreignKey: 'idUser'});
            }
        }
    });

    return Verification;
};