courser
=======

Courser is a route manager for express web framework, provides an easy way to manage routes.

Installation
---

Using NPM to install Courser module directly:

    npm install courser


Example
---

A small example of managing routes for express:

*&lt;Working Directory&gt;*/app.js

    var express = require('express');
    var Courser = require('courser');
    
    var app = express.createServer();
    
    app.configure(function() {
      app.set('views', __dirname + '/views');
    	app.set('view engine', 'jade');
    });
    
    // Loading and Initializing Routes from specific path
    var courser = new Courser(app);
    courser.addPath(__dirname + '/routes');
    courser.init(function() {
    	app.listen(3000);
    });

*&lt;Working Directory&gt;*/routes/default.js

    module.exports = {
      '/': index,
      '/hello': hello
    };
    
    function index(req, res) {
    
    	res.render('index', { title: 'Courser Example' });
    };
    
    function hello(req, res, next) {
    
      res.render('hello', { title: 'Hello' });
    };

*&lt;Working Directory&gt;*/routes/other.js

    module.exports = {
      '/other': other
    };
    
    function other(req, res) {
    
      res.render('other', { title: 'Courser Example Two' });
    };
    

All of JavaScript files(*.js) in specific path will be loaded by Courser. Developer can add more APIs or pages to existing files or new file. 
    