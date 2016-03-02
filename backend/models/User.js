'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var Project = require('./Project');
var async = require('async');
var AuthError = require('../errors/AuthError');

var schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  projects: {
    type: [Project.schema],
    default: []
  }
});

schema.virtual('password')
  .set(function (password) {
    this.plainPassword = password;
    this.salt = Math.random().toString();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this.plainPassword;
  });

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function (password) {
  return this.hashedPassword === this.encryptPassword(password);
};

schema.statics.authorise = function (username, password, callback) {
  var User = this;

  async.waterfall([
    function (callback) {
      User.findOne({username: username}, callback);
    },
    function (user, callback) {
      if (!user) {
        return callback(new AuthError('no such user'));
      }

      if (user.checkPassword(password)) {
        callback(null, user);
      } else {
        callback(new AuthError('incorrect password'));
      }
    }
  ], callback);
};

module.exports = mongoose.model('User', schema);

