var fs = require('fs');
var path = require('path');

var Courser = module.exports = function(app) {
	this.app = app || null;
	this.routeDirs = [];
	this.globalDirs = [];
};

Courser.prototype.addPath = function(newPath) {
	this.routeDirs.push(newPath);
};

Courser.prototype.addGlobalPath = function(newPath) {
	this.globalDirs.push(newPath);
};

Courser.prototype.addHandler = function(routePath, method, routeObj) {
	var self = this;

	if (routeObj instanceof Function) {

		// Using Express API to register route path
		self.app[method](routePath, routeObj);

	} else if (routeObj instanceof Array) {

		if (routeObj.length == 0)
			return;

		/* Getting all middlewares */
		var middleware = [];
		for (var index in routeObj) {
			middleware.push(routeObj[index]);
		}

		/* Take off last element which is not middleware */
		middleware.length--;

		/* Getting handler from last element */
		var handler = routeObj[index];

		// Using Express API to register route path
		self.app[method](routePath, middleware, handler);

	} else if (routeObj instanceof Object) {

		for (var m in routeObj) {
			self.addHandler(routePath, m, routeObj[m]);
		}
	}

};

Courser.prototype.loadFromFile = function(fullname) {
	var self = this;

	var routeTable = require(fullname);

	// Append route path
	for (var routePath in routeTable) {
		var routeObj = routeTable[routePath];

		if (routeObj instanceof Function) {
			self.addHandler(routePath, 'get', routeObj);
			self.addHandler(routePath, 'post', routeObj);
		} else {
			self.addHandler(routePath, 'all', routeObj);
		}
	}
};

Courser.prototype.loadFromDirectory = function(dirPath) {
	var self = this;

	// Get file list of specific path
	var files = fs.readdirSync(dirPath);

	// Load route files
	for (var j in files) {
		var filename = files[j];
		var fullname = path.join(dirPath, filename);

		var stat = fs.statSync(fullname);
		if (!stat.isFile())
			continue;

		if (path.extname(filename) != '.js')
			continue;

		self.loadFromFile(fullname);
	}

	// Open sub-folder
	for (var j in files) {
		var filename = files[j];
		var fullname = path.join(dirPath, filename);

		var stat = fs.statSync(fullname);
		if (!stat.isDirectory())
			continue;

		self.loadFromDirectory(fullname);
	}
};

Courser.prototype.init = function(callback) {
	var self = this;

	if (self.routeDirs.length > 0 && self.app) {

		// Loading global routers first
		for (var i in this.globalDirs) {
			var dirPath = this.globalDirs[i];

			self.loadFromDirectory(dirPath);
		}

		for (var i in this.routeDirs) {
			var dirPath = this.routeDirs[i];

			self.loadFromDirectory(dirPath);
		}
	}

	if (callback) {
		process.nextTick(function() {
			callback.apply(self, []);
		});
	}
};
