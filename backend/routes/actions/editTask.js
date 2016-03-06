'use strict';

var User = require('../../models/User');
var async = require('async');
var _ = require('underscore');

module.exports = function (req, res) {
    var userId = req.body.userId;
    var projectId = req.body.projectId;
    var taskId = req.body.taskId;
    var action = req.body.action;
    try {
        var value = JSON.parse(req.body.value);
    } catch (err) {
        value = req.body.value;
    }

    async.waterfall([
            function (callback) {
                User.findById({'_id': userId}, callback);
            },
            function (user, callback) {

                var newTasks = user.projects.id(projectId).tasks;

                newTasks.forEach(function (task, i) {

                    if (!task._id.equals(taskId)) return;

                    switch (action) {
                        case 'status-change':
                            newTasks[i].done = value;
                            break;

                        case 'content-change':
                            newTasks[i].content = value;
                            break;

                        case 'delete':
                            newTasks.splice(i, 1);
                            break;

                        case 'deadline-change':
                            newTasks[i].deadLine = new Date(value);
                            break;
                    }
                });

                if (action === 'renum') {
                    newTasks = value;
                }

                newTasks = _.sortBy(newTasks, 'num');
                user.projects.id(projectId).tasks = newTasks;
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
                res.status(200).send(user.projects.id(projectId));
            }
        }
    );
};
