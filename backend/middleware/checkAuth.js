'use strict';

var HttpError = require('../errors/HttpError');

module.exports = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    //next(new HttpError(403, 'User not authorised'));
    next();
  }
};