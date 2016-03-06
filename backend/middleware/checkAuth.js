'use strict';

var HttpError = require('../errors/HttpError');

module.exports = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
        console.log('user not authorised');
    }
};