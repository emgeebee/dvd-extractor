var fs = require('fs');
var extractor = require('./extractor');

exports.index = function(req, res){
	var controllers = extractor.getFiles(extractor.controlFolder);
	var listToCheck = findDuplicateOutputs(extractor.outputParentFolder);
	res.render('duplicates/index', { title: 'Route Separation Example', controllers: controllers, listToCheck:listToCheck });
}

function findDuplicateOutputs(parentfolder){
	var listToCheck = ['Are you sure your output folder is available?']
	if(fs.existsSync(parentfolder)){
		listToCheck = [];
		var vids = fs.readdirSync(parentfolder);
		for (var c = vids.length - 1; c >= 0; c--) {
			var file = vids[c];
			if(fs.lstatSync(parentfolder + '/' + file).isDirectory()){
				//if(findAndRemoveAVob(parentfolder + '/' + file)){
					//return true;
				//};
			} else {
				var extension = file.slice(file.lastIndexOf('.')+1,file.length);
				if(extension == "vob"){
					//console.log(parentfolder + '/' + file.slice(0,file.lastIndexOf('.')) + '.m4v');
					if(fs.existsSync(parentfolder + '/' + file.slice(0,file.lastIndexOf('.')) + '.m4v')){
						//logger.info(file + ' exists');
						listToCheck.push(file);
					}
					//fs.unlinkSync(parentfolder + '/' + file)
					//return true;
				}
			}
		}
	}
	return listToCheck;
}