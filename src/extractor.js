var fs = require('fs');

var DVDFolder;
var nodeDVDFolder;
var outputFolder;
var _controlFolder;
var _controlFolderBackup;
var _queuefile;
var defaultOptions;
var finalString;
var logger = require('./logs').setLogger();

var baseDir = "/Users/mat/Code/Projects/DVD\ extractor/";

var defaultString = "============";
var acceptableExtensions = ['m4v','mp4'];
var outputType = 1;
var _queueString;
var numberOfItemsInQueue = 40;
var listToCheck = [];
var _logArchive;
var _archivelogFolder;

setDefauts = function(){
	outputFolder = "/Volumes/Videos/Films/";
	_controlFolder = baseDir + "/controls/";
	_controlFolderBackup = baseDir + "Control\ backup/";
	_queuefolder = baseDir + "queue/";
	_queueString = '#!/bin/sh';


/*
	defaultFFOptions = {
		"extension":"m4v",
		"c:v" :"libx264",
		"crf":"20",
		"c:a":"libvo_aacenc",
		"b:a":"192k",
		"ac:a":"2",
		"preset":"ultrafast"
	}
*/

    mp3FFOptions = {
        "extension": "mp3",
        "acodec": "libmp3lame",
        "ac": "1",
        "ar": "44100",
        "q:a": "0",
    }

	defaultFFOptions = {
		"extension":"m4v",
		"c:v" :"libx264",
		"crf":"20",
		"c:a":"aac",
		"b:a":"192k",
		"ac:a":"2",
		"preset":"medium",
		"strict -2":"",
	}
/*

	defaultOptions = {
		"format":"mp4",
		"encoder":"x264",
		"quality":"20.0",
		"aencoder":"copy:aac",
		"native-language":"eng",
		"pfr":"",
		"rate":"30",
		"ab":"160,160",
		"mixdown":"stereo",
		"arate":"Auto",
		"drc":"0.0",
		"audio-copy-mask": "aac,ac3,dtshd,dts,mp3",
		"audio-fallback": "ffac3",
		"large-file":"",
		"loose-anamorphic":"",
		"modulus":"2",
		"markers":"",
		"x264-preset":"medium",
		"x264-profile":"high",
		"encopts":"level=4.0:ref=1:scenecut=0:bframes=0:no-deblock=1:cabac=0:analyse=none:8x8dct=0:weightp=0:me=dia:subme=0:mixed-refs=0:trellis=0:vbv-buffsize=25000:vbv-maxrate=20000:aq-mode=0:mbtree=0:rc-lookahead=0",
		"extension":"m4v"
	}*/


	mp3Options = {
		"format":"mkv",
		"quality":"50.0",
        "cfr": "-r 5",
		"encoder":"theora",
		"aencoder":"lame",
		"aq":"0",
		"native-language":"eng",
		"mixdown":"stereo",
		"arate":"Auto",
		"extension":"mkv",
        "maxHeight": 1,
        "maxWidth": 1,
		"no-dvdnav":""
	}


	defaultOptions = {
		"format":"mp4",
		"encoder":"x264",
		"quality":"20.0",
		"aencoder":"copy:aac",
		"native-language":"eng",
		"pfr":"",
		"rate":"30",
		"ab":"192,192",
		"mixdown":"stereo",
		"arate":"Auto",
		"drc":"0.0",
		"audio-copy-mask": "aac,ac3,dtshd,dts,mp3",
		"audio-fallback": "ffac3",
		"large-file":"",
		"loose-anamorphic":"",
		"modulus":"2",
		"markers":"",
		"x264-preset":"ultrafast",
		"x264-profile":"baseline",
		"encopts":"level=1.3:ref=1:scenecut=0:bframes=0:no-deblock=1:cabac=0:analyse=none:8x8dct=0:weightp=0:me=dia:subme=0:mixed-refs=0:trellis=0:vbv-buffsize=2000:vbv-maxrate=768:aq-mode=0:mbtree=0:rc-lookahead=0",
		"extension":"m4v",
		"no-dvdnav":""
	}

	finalString = "";
}

function getFiles(controlFolder){
	logger.info('controlFolderBackup');
	logger.info(controlFolder);
	var controllers = fs.readdirSync(controlFolder);
	var exportlist = [];
	for (var c = controllers.length - 1; c >= 0; c--) {
		if(controllers[c] != '.DS_Store'){
			exportlist.push(controllers[c]);
		}
	}
	return exportlist;
}

function generateQueue(controlFile){
	if(controlFile != null){
		var controllers = [controlFile];
	} else {
		var controllers = getFiles(_controlFolder);
	}
	for (var c = controllers.length - 1; c >= 0; c--) {

		var controlFile = _controlFolder + controllers[c];
		logger.info('Using control file: ' + controlFile);
		var controller = JSON.parse(fs.readFileSync(controlFile));

		DVDFolder = controller.source;
		nodeDVDFolder = DVDFolder.replace(/\\ /g, ' ');
		outputFolder = controller.outputFolder;
		if(!fs.existsSync(outputFolder)){
			fs.mkdirSync(outputFolder);
		}
		if(!fs.existsSync(_queuefolder + controllers[c])){
			fs.mkdirSync(_queuefolder + controllers[c]);
		} else {
			var oldQueueItems = getFiles(_queuefolder + controllers[c]);
			for (var h = oldQueueItems.length - 1; h >= 0; h--) {
				var item = oldQueueItems[h];
				fs.unlinkSync(_queuefolder + controllers[c] + '/' + item)
			};
		}
		
		files = controller.titles;
		if(!controller.depth){
			var depth = 0;
		} else {
			var depth = controller.depth
		}
		if(!controller.tv){
			var tv = 0;
		} else {
			var tv = controller.tv;
		}
		logger.info('Control file loaded');


		var output = prepareExtractArray(files);

		for (filmname in output){
			//Make sure we have a folder to put it in
			var folderResults = prepareFolders(output, filmname);
			var ExtractFolder = folderResults[1];

			//generate the shell script to run
			var ExtractFilename = ExtractFolder + '/' + filmname;
			console.log(ExtractFilename);
			console.log(JSON.stringify(output[filmname]));
			
            var addTags = true;
            if(controller['type'] == 0){
				var convertResults = prepareHandbrakeCLIString(ExtractFilename, output[filmname], defaultOptions);
			} else if(controller['type'] == 1){
				var convertResults = prepareFFMPEGCLIString(ExtractFilename, output[filmname], undefined, defaultFFOptions);
			} else if(controller['type'] == 2){
				if(typeof output[filmname]['options']['vobstart'] != "undefined"){
					var filestring = "\"concat:";
					var basefile = "";

					var fileNameArray = output[filmname]['options']['vobstart'].split('_');
					var startNumber = fileNameArray[fileNameArray.length - 1];
					for (var p = 0; p <= fileNameArray.length - 2; p++) {
						basefile += fileNameArray[p] + "_";
					};
					for (var t = parseInt(startNumber); t < parseInt(startNumber) + 100; t++){

						if(fs.existsSync(DVDFolder + output[filmname]['DVDFolder'] + '/VIDEO_TS/' + basefile + t + '.VOB')){
							filestring += DVDFolder + output[filmname]['DVDFolder'] + '/VIDEO_TS/' + basefile + t + '.VOB' + '|';
						}
					}

					filestring = filestring.substring(0, filestring.length - 1) + "\""
				}
				delete output[filmname]['options']['vobstart'];
				var convertResults = prepareFFMPEGCLIString(ExtractFilename, output[filmname], filestring, defaultFFOptions);
			} else if (controller['type'] === '3') {
                addTags = false;
				var convertResults = prepareHandbrakeCLIString(ExtractFilename, output[filmname], mp3Options);
                convertResults[2] = "mp3";
            }


            var tagScript = "";
            if (addTags) {
                if(tv == 0){
                    tagScript = prepareMovieTagScript(ExtractFilename, filmname);
                } else {
                    tagScript = prepareTVTagScript(ExtractFilename, filmname);
                }
            }


			//Does the output (or an acceptible alternative) already exist?)
			var doWrite = 1;
			var filenotescaped = convertResults[1].replace(/\\/g, '');
			ExtractFilename = filenotescaped + '.' + convertResults[2];
			if(output[filmname]['override'] == 0){
				if(fs.existsSync(ExtractFilename)){
					doWrite=0;
				}
				for (var i = acceptableExtensions.length - 1; i >= 0; i--) {
					var path = filenotescaped + '.' + acceptableExtensions[i];
					if(fs.existsSync(path)){
						doWrite=0;
					}
				};
			} else {
					console.log('unlinking ' + ExtractFilename)
				if(fs.existsSync(ExtractFilename)){
					fs.unlinkSync(ExtractFilename)
				}
				for (var i = acceptableExtensions.length - 1; i >= 0; i--) {
					var path = filenotescaped + '.' + acceptableExtensions[i];
					if(fs.existsSync(path)){
						fs.unlinkSync(path)
					}
				};
			}

			if(doWrite == 1){
				//Add eveything into a queue file
				addVideo(convertResults[0], folderResults[0], controllers[c], tagScript, filmname);
			}


		}
	};
	//logger.info(finalString);
}



function addVideo(convertCommand, folderCommand, folder, tagScript, name){
	var queueString = _queueString + "\n";
	queueString += folderCommand + "\n";
	queueString += convertCommand + "\n";
	queueString += tagScript + "\n";
	fs.writeFileSync(_queuefolder + folder + '/' + name + '.sh', queueString);

}



function prepareFolders(output, filmname){

	var filmFolder = outputFolder + filmname;
	var showFolder = outputFolder + output[filmname]['ExtractShow'];
	var makeFolderCLI = "";

	if(output[filmname]['ExtractShow'] === ""){
		if(output[filmname]['ExtractFolder'] !== defaultString){
			var ExtractFolder = outputFolder;
		}
	} else {
		if(!fs.existsSync(showFolder)){
			fs.mkdirSync(showFolder);
		}
		var ExtractFolder = showFolder + '/' + output[filmname]['ExtractFolder'];
	}
	ExtractFolder = ExtractFolder.replace(/ ?: ?/g, ' - ');
	if(!fs.existsSync(ExtractFolder) && ExtractFolder){
		//fs.mkdirSync(ExtractFolder);
		makeFolderCLI = 'mkdir ' + ExtractFolder.replace(/[ \(\)+&']/g, '\\$&');
	}
	return [makeFolderCLI, ExtractFolder];
}

function prepareExtractArray(files){
	var output = new Object();
	for (file in files){
		for (var i = files[file]['length'] - 1; i >= 0; i--) {
			var extract = files[file][i];
			var filename = extract['__fullname'];
			if(filename == defaultString){
				continue;
			}
			if(extract.options && extract.options.title == defaultString){
				continue;
			}
			if(!extract['__foldername']){
				var foldername = extract['__fullname'];
			} else {
				var foldername = extract['__foldername'];
			}
			if(!extract['__show']){
				var show = "";
			} else {
				var show = extract['__show'];
			}
			if(!extract['type']){
				var type = 0;
			} else {
				var type = extract['type'];
			}
			if(!extract['override']){
				var override = 0;
			} else {
				var override = extract['override'];
			}

			if(!output[filename]){
				output[filename] = {};
				output[filename]['options'] = {};
				if(extract['options']){
					output[filename]['options'] = extract['options'];
				}
				output[filename]['DVDFolder'] = file;
				output[filename]['ExtractFolder'] = foldername;
				output[filename]['ExtractShow'] = show;
				output[filename]['type'] = type;
				output[filename]['override'] = override;
			} else {

				//logger.info("Two DVD files trying to output. DVD path: " + file + ' ///// extracts: ' + files[file] + ' ///// filename: ' + filename );
			}
		}
	}
	return output;
}

function prepareMovieTagScript(filmFolder, filmname){
	var CLIstring = 'automator -i "' + filmFolder + '.' +  defaultOptions['extension'] + '" "/Users/mat/Library/Services/Batch Rip • Add Movie Tags (Filename).workflow"';
	return CLIstring;
}


function prepareTVTagScript(filmFolder, filmname){
	var CLIstring = 'automator -i "' + filmFolder  + '.' +  defaultOptions['extension'] + '" "/Users/mat/Library/Services/Batch Rip • Add TV Tags (Filename).workflow"';
	return CLIstring;
}




function prepareFFMPEGCLIString(filmFolder, extract, filestring, options){

	var videoOptions = {};
	for (option in options){
		if(option == "extension"){
			continue;
		}
		videoOptions[option] = options[option];
	}
	for (option in extract['options']){
		videoOptions[option] = extract['options'][option];
	}
	if(typeof filestring == "undefined"){
		filestring = DVDFolder + extract['DVDFolder'].replace(/[ \(\)+'&]/g, '\\$&') + '/'+ extract['DVDFolder'].replace(/[ \(\)'&]/g, '\\$&') + '.mpg';
	}

	var CLIstring = "/Applications/ffmpeg ";
	var inputDest = filestring;
	var outputDest = filmFolder.replace(/[ \(\)'+&]/g, '\\$&').replace(/ ?: ?/g, '\\ \\-\\ ').replace(/\\ \\ /g, '\\ ');
	//CLIstring += '-ss 300 -t 30 -i ' + inputDest  + ' '; //This is preview mode - grab 30 seconds from 5 mins in....
	CLIstring += ' -i ' + inputDest  + ' ';

	for (option in videoOptions){
		if(videoOptions[option][option] == ''){
			CLIstring += '-' + option + ' ';
		} else {
			CLIstring += '-' + option + ' ' + videoOptions[option] + ' ';
		}
	}

	CLIstring += ' ' + outputDest  + '.' + options['extension'] + ' ';

	//fs.writeFileSync(filmFolder, CLIstring);
	return [CLIstring, outputDest, options['format']];
}

function prepareHandbrakeCLIString(filmFolder, extract, options){

	var videoOptions = {};
	for (option in options){
		if(option == "extension"){
			continue;
		}
		videoOptions[option] = options[option];
	}
	for (option in extract['options']){
		videoOptions[option] = extract['options'][option];
	}
	//if no title specified, then add main feature
	if(typeof videoOptions['title'] == "undefined"){
		videoOptions['main-feature'] = "";
	}
	filestring = extract['DVDFolder'].replace(/[ \(\)']/g, '\\$&');

	var CLIstring = "/Applications/HandBrakeCLI ";
	var inputDest = DVDFolder.replace(/[ \(\)']/g, '\\$&') + filestring;
	var outputDest = filmFolder.replace(/[ \(\)'&]/g, '\\$&').replace(/ ?: ?/g, '\\ \\-\\ ').replace(/\\ \\ /g, '\\ ');
	CLIstring += '--input ' + inputDest  + ' ';
	CLIstring += '--output ' + outputDest  + '.' + options['extension'] + ' ';

	for (option in videoOptions){
		if(videoOptions[option][option] == ''){
			CLIstring += '--' + option + ' ';
		} else {
			CLIstring += '--' + option + ' ' + videoOptions[option] + ' ';
		}
	}
	//fs.writeFileSync(filmFolder, CLIstring);
	return [CLIstring, outputDest, options['format']];
}


setDefauts();

module.exports.getFiles = getFiles;
module.exports.generateQueue = generateQueue;
module.exports.controlFolder = _controlFolder;
module.exports.controlFolderBackup = _controlFolderBackup;
module.exports.outputParentFolder = outputFolder;
module.exports.defaultString = defaultString;
