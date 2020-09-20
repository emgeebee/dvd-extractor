var fs = require('fs');
var extractor = require('./extractor');
var logs = require('./logs');
var logger = logs.setLogger();

exports.index = function(req, res){
	var controllers = extractor.getFiles(extractor.controlFolder);
	res.render('index', { title: 'Route Separation Example', controllers: controllers });
}

exports.config = function(req, res){
	var controlFolder = extractor.controlFolder;
	var controllers = extractor.getFiles(controlFolder);
	var controlFile = req.params.id;
	var defaultString = extractor.defaultString;
	if(controlFile == "New"){
		var jsonFile = {"source":"~/Videos","outputFolder":"~/Videos","depth":0,"type":"0","title":"new.json","titles":[]}
		controlFile = "new.json";
	} else {
		var jsonFile = JSON.parse(fs.readFileSync(controlFolder + controlFile));
		logger.info(jsonFile);
		jsonFile = markFilesWithNoExtract(jsonFile, defaultString);
		jsonFile = markTVFiles(jsonFile);
		jsonFile = checkLogs(jsonFile);
	}
	//compareFileSystemToController(jsonFile, controlFolder + controlFile);
	res.render('config/index', { title: controlFile, controllers: controllers, json: jsonFile, defaultString : defaultString });
}

exports.save = function(req, res){
	var controlFolder = extractor.controlFolder;
	var controlFolderBackup =  extractor.controlFolderBackup;
	var controller = req.body
	if(req.params.id == "New"){
		var controlFile = req.params.id;
		controller.titles = {};
	} else {
		var controlFile = controller.title;
		var date = new Date();
		var dateStamp = '_' + date.getFullYear() + '_' + date.getMonth() + 1 + '_' + date.getDay() + '_' + date.getHours() + '_' + date.getMinutes()+ '_' + date.getSeconds();
		if(fs.existsSync(controlFolderBackup + controlFile)){
			fs.writeFileSync(controlFolderBackup + controlFile + dateStamp , fs.readFileSync(controlFolderBackup + controlFile));
		}
	}
	var newFileName = controller.title
	fs.writeFileSync(controlFolder + newFileName, JSON.stringify(controller, null, 4));
	var DVDFolder = controller.source;
	if(controller.source.slice(-1) !== '/'){
		DVDFolder += '/';
	}
	nodeDVDFolder = DVDFolder.replace(/\\ /g, ' ');
	if(!controller.titles){
		files = {};
	} else {
		files = controller.titles;
	}
	if(!controller.depth){
		depth = 0;
	} else {
		depth = controller.depth
	}
	if(fs.existsSync(nodeDVDFolder)){
		var DVDs = fs.readdirSync(nodeDVDFolder);
		saveBackupControls.call(DVDs, nodeDVDFolder, files, depth);
	}	res.send(200, 'Done');
}

exports.generate = function(req, res){	var controlFile = req.params.id;
	exports.save(req, res);
	extractor.generateQueue(controlFile);
	res.send(200, 'Done');
}

exports.deleteFailure = function(req, res){	var controlFolder = extractor.controlFolder;
	var controlFile = req.params.id;
	var jsonFile = JSON.parse(fs.readFileSync(controlFolder + controlFile));	if(fs.existsSync(jsonFile.outputFolder + req.body.output + '/' + req.body.output + '.m4v')){
		fs.unlinkSync(jsonFile.outputFolder + req.body.output + '/' + req.body.output + '.m4v');
	}
	if(fs.existsSync(jsonFile.outputFolder + req.body.output)){
		fs.rmdirSync(jsonFile.outputFolder + req.body.output);
	}	res.send(200, 'Done');
}

exports.refreshList = function(req, res){
	var controlFolder = extractor.controlFolder;
	var controlFile = req.params.id;
	var jsonFile = JSON.parse(fs.readFileSync(controlFolder + controlFile));
	var defaultString = extractor.defaultString;	compareFileSystemToController(jsonFile, controlFolder + controlFile);	res.send(200, 'Done');
}

markFilesWithNoExtract = function(jsonfile, defaultString){
	for (title in jsonfile.titles){
		titleFile = jsonfile.titles[title];
		var status = "willExtract";
		if(titleFile.length == 0){
			status = "panel-warning";
		}
		for (var i = titleFile.length - 1; i >= 0; i--) {
			if(titleFile[i].__fullname == defaultString || (titleFile[i].options && titleFile[i].options.title == defaultString)){
				status = "panel-warning";
			}
		};
		jsonfile.titles[title].status = status;
	}
	return jsonfile;
}

markTVFiles = function(jsonfile){
	for (title in jsonfile.titles){
		titleFile = jsonfile.titles[title];
		var hasTVShow = 0;
		var isFolderDiff = 0;
		for (var i = titleFile.length - 1; i >= 0; i--) {
			var tvFile = 0;
			if(typeof titleFile[i].__show  == "undefined" || titleFile[i].__show  == ""){
			} else {
				tvFile = 1;
				hasTVShow = 1;
			}
			if(typeof titleFile[i].__foldername  == "undefined" || titleFile[i].__foldername  == ""){
			} else {
				isFolderDiff = 1;
			}
			jsonfile.titles[title][i].tvFile = tvFile;
			jsonfile.titles[title][i].isFolderDiff = isFolderDiff;
		};
		jsonfile.titles[title].hasTVShow = hasTVShow;
	}
	return jsonfile;
}

checkLogs = function(jsonfile){
	var extractsInLogArray = logs.getItemsFromLogs();
	for (var j = extractsInLogArray.length - 1; j >= 0; j--) {
		var extractWithoutFolder = extractsInLogArray[j].name.split('/')[1];
		var extractWithFolder = extractsInLogArray[j].name;
		attempts = [extractWithFolder, extractWithoutFolder];
		for (var k = 0; k < attempts.length; k++) {
			var extract = attempts[k];
			if(typeof jsonfile.titles != "undefined"){
				if(typeof jsonfile.titles[extract] != "undefined"){
					for (var i = jsonfile.titles[extract].length - 1; i >= 0; i--) {
						extractOptions = jsonfile.titles[extract][i];
						if(typeof extractOptions.options != "undefined" && typeof extractOptions.options.title != "undefined"){
							if(extractsInLogArray[j].title == extractOptions.options.title){
								setRunStatusOfExtract.call(jsonfile.titles[extract][i], extractsInLogArray[j]);
							}
						} else {
							setRunStatusOfExtract.call(jsonfile.titles[extract][i], extractsInLogArray[j]);
						}
					};
				}
			}
		};
	};
	for (title in jsonfile.titles){
		var extracts = jsonfile.titles[title];
		var status = "";
		if(typeof jsonfile.titles[title]['status'] != null){
			status = jsonfile.titles[title]['status'];
		}
		var successCount = 0;
		var errorCount = 0;
		for (var i = extracts.length - 1; i >= 0; i--) {
			if(extracts[i]['status'] == "alert-success"){
				status = "panel-success";
				successCount++;
			}
		};
		for (var i = extracts.length - 1; i >= 0; i--) {
			if(extracts[i]['status'] == "alert-danger"){
				status = "panel-danger";
				errorCount++;
			}
		};
		jsonfile.titles[title]['status'] = status;
		jsonfile.titles[title]['successCount'] = successCount;
		jsonfile.titles[title]['errorCount'] = errorCount;
	}
	return jsonfile;
}

function setRunStatusOfExtract(logResults){
	if(typeof this['logs'] != "undefined") {
		this['logs'].push(logResults);
	} else {
		this['logs'] = [logResults];
	}
	if(parseInt(logResults.complete) >= 99){
		this['status'] = "alert-success";
		this['completeFlag'] = 1;
	} else if(parseInt(logResults.complete) < 99 && typeof this['status'] == "undefined") {
		this['status'] = "alert-danger";
	}
};

function compareFileSystemToController(controller, controlFile){
	DVDFolder = controller.source;
	nodeDVDFolder = DVDFolder.replace(/\\ /g, ' ');
	if(!fs.existsSync(nodeDVDFolder)){
		return;
	}
	outputFolder = controller.outputFolder;
	files = controller.titles;
	if(typeof files === "undefined"){
		files = {};
	}
	if(!controller.depth){
		depth = 0;
	} else {
		depth = controller.depth
	}
	if(controller.type == 1){
		var missingDVDs = checkForMissingVideos(nodeDVDFolder, files, depth);
		//logger.info('Missing DVDs:');
		//logger.info(missingDVDs);
	} else {
		var missingDVDs = checkForMissingDVDs(nodeDVDFolder, files, depth);
	}	
	//controller.missingDVDs = missingDVDs;
	files = cleanControlJSON(nodeDVDFolder, files);
	for (dvd in missingDVDs){
		if(typeof files[dvd] == "undefined"){
			files[dvd] = missingDVDs[dvd];
		}
	}
	controller.titles = files;
	delete controller.missingDVDs;
	fs.writeFileSync(controlFile, JSON.stringify(controller, null, 4));
	return controller;
};

function cleanControlJSON(internalnodeDVDFolder, files){
	for (dvdPath in files ) {
		if (!fs.existsSync(internalnodeDVDFolder + dvdPath)){
			//logger.info('Removing from JSON ' + dvdPath);
			delete files[dvdPath];
		}
	};
	return files;
};

function saveBackupControls(internalnodeDVDFolder, files, depth, folder){	for (var c = this.length - 1; c >= 0; c--) {
		if(!fs.lstatSync(internalnodeDVDFolder + this[c]).isDirectory()){
			continue;
		}
		if(depth > 0){
			var newPath = internalnodeDVDFolder + this[c] + '/';
			var DVDs = fs.readdirSync(newPath);
			var newDepth = depth - 1;
			var newFolderName = this[c];
			saveBackupControls.call(DVDs, newPath, files, newDepth, newFolderName);
			continue;
		}
		var dvd = this[c];
		if(folder != undefined && folder != ""){
			dvd = folder + '/' + dvd;
		}		if(!files[dvd]){		}else{
			try {
				fs.writeFileSync(internalnodeDVDFolder  + this[c]  + '/control.json', JSON.stringify(files[dvd], null, 4));
			} catch (e){			}
		}
		//console.log (list);
	}
};

function checkForMissingVideos(internalnodeDVDFolder, files, depth){
    console.log('here');
	var defaultString = extractor.defaultString;
	var list = {};
	var DVDs = fs.readdirSync(internalnodeDVDFolder);
	for (var c = DVDs.length - 1; c >= 0; c--) {
		if(!fs.lstatSync(internalnodeDVDFolder + DVDs[c]).isDirectory()){
			continue;
		}
		var dvd = DVDs[c];
		if(!files[dvd]){
			list[dvd] = [];
			try{
                console.log('trying to load from local backup');
				list[dvd] = JSON.parse(fs.readFileSync(internalnodeDVDFolder + dvd + '/control.json'));
                console.log('loaded from local backup', list[dvd]);
				continue;
			} catch(err){
				//logger.info('Brand new file ' + dvd);
			}
			var extract = {};
			extract.__fullname = defaultString;
			extract.type = 1;
			extract.options = {};
			list[dvd].push(extract);
		} else {
			try {
				fs.writeFileSync(internalnodeDVDFolder  + dvd  + '/control.json', JSON.stringify(files[dvd], null, 4));
			} catch (e){			}
		}
		//console.log (list);
	}
	return list;
};

function checkForMissingDVDs(internalnodeDVDFolder, files, depth, folder){
    console.log(arguments);
	var defaultString = extractor.defaultString;
	var list = {};
	var DVDs = fs.readdirSync(internalnodeDVDFolder);	var seasonTest = new RegExp('[S][0-9]');
	var episodeTest = new RegExp('[E][0-9]');
	for (var c = DVDs.length - 1; c >= 0; c--) {
		if(!fs.lstatSync(internalnodeDVDFolder + DVDs[c]).isDirectory()){
			continue;
		}
		if(depth > 0){
			var missingSubFiles = checkForMissingDVDs(internalnodeDVDFolder + DVDs[c] + '/', files, depth - 1, DVDs[c]);
			for(missingItem in missingSubFiles){
				list[missingItem] = missingSubFiles[missingItem];
			}
			continue;
		}
		var VIDEOTS = internalnodeDVDFolder + DVDs[c] + '/' + 'VIDEO_TS';
		if(!fs.existsSync(VIDEOTS)){
			continue;
		}
		var dvd = DVDs[c];
		if(folder != undefined && folder != ""){
			dvd = folder + '/' + dvd;
		}
        if(!files[dvd]){
			//list.push(DVDs[c]);
			try {
                console.log('trying to load from local backup', internalnodeDVDFolder, dvd, '/control.json');
				list[dvd] = JSON.parse(fs.readFileSync(internalnodeDVDFolder + dvd.split('/')[dvd.split('/').length-1] + '/control.json'));
                console.log('loaded from local backup', internalnodeDVDFolder + dvd + '/control.json', list[dvd]);
				continue;
			} catch(err){}
			var nameArray = dvd.split(' ');
			var season;
			var episodeMax = 0;
			var episodeMin = 100000000000;
			var isFilm = 1;
			for (var i = nameArray.length - 1; i >= 0; i--) {
				if(seasonTest.test(nameArray[i])){
					season = nameArray[i];
				}
				if(episodeTest.test(nameArray[i])){
					var ep = parseInt(nameArray[i].slice(1));
					if(ep > episodeMax){
						episodeMax = ep;
					}
					if(ep < episodeMin){
						episodeMin = ep;
					}
					isFilm = 0;
				}
			};			var title = dvd.substring(0,dvd.lastIndexOf(season) - 1);
			title = title.substring(title.indexOf('/')+1);
            list[dvd] = [];
            if (isFilm == 0){
				for (var j = episodeMin; j <= episodeMax; j++){
					var extract = {};
					extract.__fullname = title + ' ' + season + ' E' + j;
					extract.__foldername = season;
					extract.__show = title;
					extract.options = {};
					extract.options.title = defaultString;
					list[dvd].push(extract);				}
			} else {
				var extract = {};
				extract.__fullname = defaultString;
				extract.options = {};
				list[dvd].push(extract);			}
		} else {
			fs.writeFileSync(internalnodeDVDFolder  + DVDs[c]  + '/control.json', JSON.stringify(files[dvd], null, 4));
		}
	}
	return list;
}
