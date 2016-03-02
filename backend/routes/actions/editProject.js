'use strict';

var User = require('../../models/User');
var async = require('async');

module.exports = function (req, res) {
  var userId = req.body.userId;
  var projectId = req.body.projectId;
  var action = req.body.action;
  var value = req.body.value;

  async.waterfall([
      function (callback) {
        User.findById({'_id': userId}, callback);
      },
      function (user, callback) {
        if (action === 'delete') {
          user.projects = user.projects.filter(function (proj) {
            return !proj._id.equals(projectId);
          });
        } else if (action === 'title-change') {
          user.projects.id(projectId).name = value
        }

        user.save(callback);
      }
    ],
    function (err, user) {
      if (err) {
        console.log(action, 'error');
        console.log(err);
        res.status(400).send(err);
      } else {
        console.log(action, 'success');
        res.status(200).send(user.projects);
      }
    }
  );
};