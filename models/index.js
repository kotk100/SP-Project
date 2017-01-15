"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
if (process.env.RDS_HOSTNAME) {
  var host      = process.env.RDS_HOSTNAME,
      user     = process.env.RDS_USERNAME,
      password = process.env.RDS_PASSWORD,
      port     = process.env.RDS_PORT,
      name     = process.env.RDS_DB_NAME;
  var sequelize = new Sequelize('mariadb://' + user + ':' + password + '@' + host + ':' + port + '/' + name);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
