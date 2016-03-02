'use strict';

var mongoose = require('mongoose');
var Task = require('./Task');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tasks: {
    type: [Task.schema],
    default: []
  }
});

module.exports = mongoose.model('Project', schema);