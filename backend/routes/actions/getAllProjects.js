'use strict';

var User = require('../../models/User');
var async = require('async');

module.exports = function (req, res) {
  var userId = req.body.userId;

  async.waterfall([
    function (callback) {
      User.findOne({_id: userId}, callback);
    },
    function (user, callback) {
      if (!user) {
        return callback(new Error('User not found'));
      } else {
        return callback(null, user.projects);
      }
    }
  ], function (err, projects) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(projects);
    }
  });
};