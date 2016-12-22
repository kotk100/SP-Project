var express = require('express');
var router  = express.Router();

//Render the about page
router.get('/', function(req, res){
    return res.render('about', {layout: 'footer', cssFile: 'register', lang: req.locale});
});

module.exports = router;