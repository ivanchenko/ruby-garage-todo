var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var config = require('./config/index');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var http = require('http');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, '../favicon.ico')));

app.use('/prod', express.static(path.join(__dirname, '../prod')));
app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/')));

app.use(session({
    secret: config.get('session:secret'),
    cookie: config.get('session:cookie'),
    key: config.get('session:key'),
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: true,
    saveUninitialized: true
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

require('./routes')(app);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(require('./middleware/errorHandler'));

/** Mongo connection **/

var dbUri = config.get('MONGOLAB_URI') || config.get('mongoose:uri');
var options = config.get('mongoose:options');

mongoose.connect(dbUri, options, function (err) {
    if (err) {
        console.log('ERROR connecting to: ' + dbUri);
        console.log(err);
    } else {
        console.log('Succeeded connect to: ' + dbUri);
    }
});

/** Server connection **/

var server = http.createServer(app);

var serverIp = config.get('ip');
var serverPort = config.get('PORT') || config.get('port');

//server.listen(serverPort, serverIp);
server.listen(serverPort, function () {
    console.log("App now running address:", server.address().address, "port:", server.address().port);
});

module.exports = app;
