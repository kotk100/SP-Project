var models  = require('../models');
var logger = require('../config/logger.js');
var express = require('express');
var router  = express.Router();
var ttLoader = require('../data/getTimetableById');

router.get('/', function(req, res){
    models.Setting.findById();//uuser id

    ttLoader.getData('63140099', '16');

    res.render('settings', { cssFile:'settings'});
});

module.exports = router;