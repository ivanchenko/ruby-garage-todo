'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
        default: false
    },
    num: {
        type: Number,
        required: true
    },
    deadLine: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Task', schema);