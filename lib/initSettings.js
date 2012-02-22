var fs = require("fs");
var settings = require("../settings.json");
var path = require("path");

var jarsDirectory = {
	check: function() {
		var self = this;
		if (!self.existsDirectory()) {
			//Try to find the illumina2bam dist directory
			var newDir = self.locate();
			if (newDir !== null && newDir !== undefined) {
				//Found new dir
				settings.illumina2bam.jarsDirectory = newDir;
				writeSettings();
			}
		};
	},
	locate: function() {
		var self = this;
		var rootPath = path.normalize(__dirname + "/../../");
		var foundDir = self.checkDirectory(rootPath);
		return foundDir;
	},
	checkDirectory: function(dirPath) {
		var self = this;
		var dirContents = fs.readdirSync(dirPath);
		var foundDir = null;
		for (var i = 0; i < dirContents.length; i++) {
			var fileName = dirContents[i];
			var filePath = path.normalize(dirPath + "/" + fileName);
			var isDir = fs.lstatSync(filePath).isDirectory();
			if (isDir) {
				var result = self.checkDirectory(filePath);
				if (result !== null) {
					foundDir = result;
					break;
				}
			} else {
				if (fileName === "illumina2bam.jar") {
					foundDir = dirPath;
					break;
				}
			}
		};
		return foundDir;
	},
	existsDirectory: function() {
		if (settings.illumina2bam.jarsDirectory === null) {
			return false;
		} else {
			//Make sure dir exists
			var jarsDir = null;
			try {
				jarsDir = fs.lstatSync(settings.illumina2bam.jarsDirectory);
			} catch(err) {
				console.error("Directory " + settings.illumina2bam.jarsDirectory + " does not exist.")
				return false;
			}
			if (jarsDir !== null) {
				return jarsDir.isDirectory();
			}
		}
	}
};

function writeSettings() {
	var settingsFilePath = path.normalize(__dirname + "/../settings.json");
	fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, "\t"), "utf8");
}

exports.init = function() {
	jarsDirectory.check();
};
