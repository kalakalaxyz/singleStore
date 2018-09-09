const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;

const User = require('./models/user');
const config = require('./config/default.js');
const redis = require('./lib/redis.js');

module.exports = function(passport) {
    passport.use(new Strategy(
        function(token, done) {
            redis.get('Bearer ' + token,function(err, data) {
                if(err) {
                    return done(err);
                }
                if(!data) {
                    return done(null, false);
                }
                return done(null, data);
            });
        }
    ));
};
