'use strict';

var User = require('../../models/User');
var Project = require('../../models/Project');
var async = require('async');

module.exports = function (req, res) {
  var userId = req.body.userId;
  var projectName = req.body.projectName;

  async.waterfall([
    function (callback) {
      User.findOne({_id: userId}, callback);
    },
    function (user, callback) {
      if (!user) {
        return callback(new Error('User not found'));
      }

      var newProject = new Project({name: projectName});

      user.projects.push(newProject);
      user.save(function (err) {
        callback(err, newProject)
      });
    }
  ], function (err, project) {
    if (err) {
      console.log('add project error');
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log('add project success');
      res.status(200).send(project);
    }
  });
};