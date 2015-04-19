// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var flash = require('connect-flash');

// configuration ===========================================

var userName = process.env.OPENSHIFT_MONGODB_DB_USERNAME || '';
var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || '';
var mongoDBHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongoDBPort = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017';
var host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var uri = 'mongodb://' + userName + ':' + password + '@' + mongoDBHost + ':' + mongoDBPort + '/webdevproj';
if (userName == '') {
    uri = 'mongodb://' + mongoDBHost + ':' + mongoDBPort + '/webdevproj';
}
console.log(uri);
mongoose.connect(uri);

// config files
var db = require('./config/db');
var models = require('./app/models/Models.js');
var userDao = require('./app/dao/UserDao.js');
var helper = require('./app/helper.js');


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(session({ secret: 'ayaskantsahu' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(morgan('dev')); // log every request to the console
app.use(flash());

// routes ==================================================
require('./config/passport')(passport);
require('./app/routes')(app, passport); // pass our application into our routes

// start app ===============================================
var server = app.listen(port, host, function () {

    console.log('Example app listening at http://%s:%s', host, port)

});			// shoutout to the user

exports = module.exports = app; 						// expose app

