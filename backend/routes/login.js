'use strict';

var User = require('../models/User');
var HttpError = require('../errors/HttpError');
var AuthError = require('../errors/AuthError');
var async = require('async');

module.exports.get = function (req, res) {
  res.render('login', {title: 'Login page'});
};

module.exports.post = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var type = req.body.type;

  switch (type) {
    case 'login':
      User.authorise(username, password, function (err, user) {
        if (err) {
          if (err instanceof AuthError) {
            return next(new HttpError(403, err.message))
          } else {
            return next(err);
          }
        }

        req.session.user = user;
        res.status(200).send({userId: user._id, username: user.username});
      });
      break;

    case 'signup':
      var user = new User({username: username, password: password});
      user.save((err) => {
        if (err) return next(err);

        req.session.user = user;
        res.status(200).send({userId: user._id, username: user.username});
      });
      break;

    default:
      res.status(404).send('No such type');
      break;
  }
};