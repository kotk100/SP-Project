var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('./config/passport');
var i18n = require("i18n");

var index = require('./routes/index');
var about = require('./routes/about');
var register = require('./routes/register');
var login = require('./routes/login');
var settings = require('./routes/settings');
var lecture = require('./routes/lecture');

var app = express();

//Configure i18n
i18n.configure({
    locales:['en', 'sl'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    syncFiles: true
});

app.use(i18n.init);

//set view engine
var handlebars  = require('./config/handlebars')(exphbs, i18n);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, '/public/source'),
  dest: path.join(__dirname, '/public/compiled'),
  indentedSyntax: true,
  sourceMap: true,
  force: true,
  response: false,
  debug: true
}));
app.use(express.static(path.join(__dirname, 'public/compiled')));

//Force language if specified
app.use(function(req, res, next){
    var match = req.url.match(/^\/(en|sl)([\/\?].*)?$/i);
    if (match){
        req.setLocale(match[1]);
        req.url = match[2] || '/';
    }
    next();
});

app.use('/register', register);
app.use('/login', login);
app.use('/about', about);

app.get('/message', function(req, res){
    res.render('mesg', { cssFile:'error', layout: 'footer', error: req.session.error, message: req.session.message });
    req.session.message = null;
});


app.get('/*', function(req, res){
    if(req.user)
        return req.next();
    else
        return res.redirect('/' + req.locale + '/login');
});

app.use('/lecture', lecture);
app.use('/settings', settings);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.render('error', { cssFile:'error', layout: 'footer' });
});

module.exports = app;
