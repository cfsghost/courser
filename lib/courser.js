var fs = require('fs');
var path = require('path');

var Courser = module.exports = function(app) {
	this.app = app || null;
	this.routeDirs = [];
	this.routes = {};
};

Courser.prototype.addPath = function(newPath) {
	this.routeDirs.push(newPath);
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
		middleware.length--;

		/* Getting handler from last element */
		var handler = routeObj[index];

		// Using Express API to register route path
		self.app[method](routePath, middleware, handler);

	} else if (routeObj instanceof Object) {

		for (var m in routeObj) {
			self.addHandler(routePath, m, routeObj);
		}
	}

};

Courser.prototype.init = function(callback) {
	var self = this;

	if (this.routeDirs.length > 0 && this.app) {

		for (var i in this.routeDirs) {
			var dirPath = this.routeDirs[i];

			// Get file list of specific path
			var files = fs.readdirSync(dirPath);

			// Load route files
			for (var j in files) {
				var routeTable = require(path.join(dirPath, files[j]));

				// Append route path
				for (var routePath in routeTable) {
					var routeObj = routeTable[routePath];

					self.addHandler(routePath, 'all', routeObj);
				}
			}
		}
	}

	if (callback) {
		process.nextTick(function() {
			callback.apply(self, []);
		});
	}
};
