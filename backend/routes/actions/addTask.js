'use strict';

var User = require('../../models/User');
var Task = require('../../models/Task');
var async = require('async');

module.exports = function (req, res) {
  var userId = req.body.userId;
  var projectId = req.body.projectId;
  var taskContent = req.body.taskContent;

  async.waterfall([
      function (callback) {
        User.findById({_id: userId}, callback);
      },
      function (user, callback) {
        if (!user) {
          callback(new Error());
        } else {

          var newTask = new Task({
            content: taskContent,
            num: user.projects.id(projectId).tasks.length
          });

          try {
            user.projects.id(projectId).tasks.push(newTask);
          } catch (err) {
            return callback(err);
          }

          user.save(function (err) {
            callback(err, newTask);
          });
        }
      }
    ],
    function (err, task) {
      if (err) {
        console.log('add task error');
        res.status(400).send(err);
      } else {
        console.log('add task success');
        res.status(200).send(task);
      }
    }
  )
}
;