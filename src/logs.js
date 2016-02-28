var fs = require('fs');
var winston = require('winston');
var extractor = require('./extractor');

var titleRegex = /^\+ title [0-9]*/;
var destinationRegex = / \* destination/;
var sourceRegex = /.*Opening.*/;
var percentageRegex = /Encoding: task.*/;

var _logfile = _logfolder + "DVD_scan1.txt";
var _logfolder = __dirname + "/../logs/";
var _logArchive = __dirname + "/../logs/archive.json";
var _archivelogFolder = __dirname + "/../logarchive/";

function setLogger(){
	console.log('3');
	var logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.File)({
				filename: _logfile,
      			colorize: 'true',
      			datePattern: '.yyyy-MM-dd',
      			maxsize: 2000000
      		})
		]
	});
	console.log('3');
	return logger;
}

exports.setLogger = setLogger;


exports.index = function(req, res){
	var extractsInLogArray = exports.getItemsFromLogs();
	var controllers = extractor.getFiles(extractor.controlFolder);
	
	for (var i = extractsInLogArray.length - 1; i >= 0; i--) {
		if (parseInt(extractsInLogArray[i].complete) < 99){
			extractsInLogArray[i].status = "panel-danger";
		} else {
		extractsInLogArray[i].status = "panel-success";	
		}
	};

	res.render('logs/index', { title: 'Log viewer', controllers: controllers, extractsInLogArray: extractsInLogArray });
}

exports.getItemsFromLogs = function(){
	var archivelogFolder = extractor.archivelogFolder;
	var logs = extractor.getFiles(_logfolder);
	var extractsInLogArray = [];
	var archivedLogs = [];
	if (fs.existsSync(_logArchive)) {
		archivedLogs = JSON.parse(fs.readFileSync(_logArchive));
	}

	for (var j =  0; j < logs.length; j++) {
		var logFile = logs[j];
		var archive = 0;
		if(!logFile.match(/queueoutput_/g)){
			continue;
		}

		var timestring = logFile.split('queueoutput_')[1];
		var month = timestring.slice(4,6) - 1
		var year = timestring.slice(0,4)
		var day = timestring.slice(6,8)
		var date = new Date(year, month, day);
		var today = new Date();
		if (date < new Date(today - 3600000*24*2)){
			archive = 1;
		}

		var fullLogFile = fs.readFileSync(_logfolder + logFile);
		if(fullLogFile == ""){
			continue
		}
		var logFileArray = fullLogFile.toString().split('\n');
		var extractName = "";
		var percentComplete = "";
		var title = "";
		var destination = "";
		for (var i = logFileArray.length - 1; i >= 0; i--) {
			var lineOfLog = logFileArray[i];
			if(percentComplete == "" && percentageRegex.test(lineOfLog)){
				percentCompleteArray = lineOfLog.split('\r');
				percentComplete = lineOfLog.split('%')[0].slice(-7, -1)
				extractName = "";
			} else if(titleRegex.test(lineOfLog)){
				title = lineOfLog.split('title ')[1].slice(0,-1);
			} else if(destinationRegex.test(lineOfLog)) {
				destination = logFileArray[i + 1].split('+')[1];
			} else if(sourceRegex.test(lineOfLog)){
				var extractArray = lineOfLog.split('/');
				extractName = extractArray[extractArray.length-1].slice(0,-3);
				extractNameAlt = extractArray[extractArray.length-2] + '/' + extractArray[extractArray.length-1].slice(0,-3);
				if(parseInt(percentComplete) > 1){
					extractsInLogArray.push({name:extractNameAlt, complete:percentComplete, title: title, log:logFile, destination:destination});
					if(archive){
						console.log(archivedLogs);
						archivedLogs.push({name:extractNameAlt, complete:percentComplete, title: title, log:logFile, destination:destination});
					}
				}
				percentComplete = "";
				title = "";
			}
		};
		if(archive){
			fs.renameSync(_logfolder + logFile, archivelogFolder + logFile);
		}
	};

	fs.writeFileSync(_logArchive, JSON.stringify(archivedLogs));
	for (var i = archivedLogs.length - 1; i >= 0; i--) {
		extractsInLogArray.push(archivedLogs[i]);
	};
	return extractsInLogArray;
}