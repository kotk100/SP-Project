var express = require('express');
var router  = express.Router();

router.get('/', function(req, res){
    return res.render('about', {layout: 'footer', cssFile: 'register'});
});

module.exports = router;