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
		var rootPath = path.normalize("./../../");
		var foundDir = self.checkDirectory(rootPath);
		return path.resolve(foundDir);
	},
	checkDirectory: function(dirPath) {
		var self = this;
		var dirContents = [];
		try {
			dirContents = fs.readdirSync(dirPath);
		} catch(err) {
			dirContents = [];
		}
		var foundDir = null;
		for (var i = 0; i < dirContents.length; i++) {
			var fileName = dirContents[i];
			var filePath = path.normalize(dirPath + "/" + fileName);
			var isDir = false;
			try {
				isDir = fs.lstatSync(filePath).isDirectory();
			} catch (err) {
				isDir = false;
			}

			if (isDir && fileName.substr(0, 1) !== "." && fileName !== "illumina2bam-tools") {
				var result = self.checkDirectory(filePath);
				if (result !== null) {
					foundDir = result;
					break;
				}
			} else {
				if (fileName.substr(0, 1) !== "." && fileName === "illumina2bam.jar") {
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
	try {
		fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, "\t"), "utf8");
	} catch(err) {
		console.error("Could not write to settings file: ");
		console.error(err);
	}
}

exports.init = function() {
	jarsDirectory.check();
};
