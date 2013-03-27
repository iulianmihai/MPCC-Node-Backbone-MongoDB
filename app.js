var express = require('express');
var http = require('http');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var dbPath = 'mongodb://IN4363/MPCC_Connect';
var fs = require('fs');
var events = require('events');

app.server = http.createServer(app);

var eventDispatcher = new events.EventEmitter();

app.addEventListener = function(eventName, callback){
    eventDispatcher.on(eventName, callback);
};
app.removeEventListener =function(eventName, callback){
    eventDispatcher.removeListener(eventName, callback);
};
app.triggerEvent = function(eventName, eventOptions){
    eventDispatcher.emit(eventName, eventOptions);
}

app.sessionStore = new MemoryStore();

var mongoose = require('mongoose');
var config = {
    mail:require('./ServerSide/config/mail')
};
var models = {
    Account:require('./ServerSide/models/account')(app, config, mongoose, nodemailer)
};

app.configure(function () {
    app.sessionSecret = 'MpccConnect secret key';
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/ClientSide'));
    app.set('views', __dirname + '/ServerSide/views');
    app.use(express.limit('1mb'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: app.sessionSecret,
        key: 'express.sid',
        store: app.sessionStore
    }));
    mongoose.connect(dbPath, function onMongooseError(err) {
        if (err) throw err;
    });
});

fs.readdirSync('./ServerSide/routes').forEach(function(file) {
    if ( file[0] == '.' ) return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./ServerSide/routes/' + routeName)(app, models);
});

app.get('/', function (req, res) {
    res.render('index.jade');
});



app.server.listen(3030);
console.log('Listening on port 3030');