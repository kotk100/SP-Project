var passport = require('passport');
var logger = require('./logger.js');
var models  = require('../models');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function(username, password, cb) {
        models.User.findOne({
            where: {
                $or: [
                    {username: username},
                    {email: username}
                ],
                verified: true
            }
        }).then(function(user){
            //Check password
            if(user) {
                bcrypt.compare(password, user.password).then(function (res) {
                    if (!res) {
                        logger.debug('User login failed.');
                        return cb(null, false);
                    } else //return user
                        logger.debug('User login successful.');
                    return cb(null, user.idUser);
                });
            } else {
                logger.debug('User login failed.');
                return cb(null, false);
            }
        }, function(err){
            logger.error('Error reading user!', err);
            return cb(err);
        });
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(userId, cb) {
    return cb(null, userId);
});

passport.deserializeUser(function(userId, cb) {
    return cb(null, userId);
});

module.exports = passport;
