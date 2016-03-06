var errorHandler = require('errorhandler');
var HttpError = require('../errors/HttpError');
var config = require('../config');

module.exports = function (err, req, res, next) {

    if (err instanceof Number) {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (config.get('NODE_ENV') === 'dev') {
            errorHandler()(err, req, res, next);
        } else {
            console.log(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
};