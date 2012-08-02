var express = require('express');
var Courser = require('courser');

var app = express.createServer();

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
});

// Initializing Routes
var courser = new Courser(app);
courser.addPath(__dirname + '/routes');
courser.init(function() {
	app.listen(3000);
});

