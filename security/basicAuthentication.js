var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    users = require('./users');

module.exports = function (app) {
    passport.use(new BasicStrategy({}, users.check));
    app.use(passport.initialize());

    app.get(/\/.*/, passport.authenticate('basic', {session: false}), function (req, res, next) {
        next();
    });
};
