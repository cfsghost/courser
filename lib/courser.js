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
					this.routes[routePath] = routeTable[routePath];
				}
			}

			// Apply on application
			for (var routePath in this.routes) {

				// Using Express API to register route path
				self.app.all(routePath, self.routes[routePath]);
			}
		}
	}

	if (callback) {
		process.nextTick(function() {
			callback.apply(self, []);
		});
	}
};
