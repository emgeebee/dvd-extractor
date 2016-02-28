var fs = require('fs');

var _controlFile = "/Users/mat/GDrive/Dropbox/Code/DVD\ extractor/controls/control-tv.json";
var _controlFile2 = "/Users/mat/GDrive/Dropbox/Code/DVD\ extractor/controls/control-tv2.json";
var control = JSON.parse(fs.readFileSync(_controlFile));

var seasonTest = new RegExp('[S][0-9]');
var episodeTest = new RegExp('[E][0-9]');

for (dvd in control){
	var nameArray = dvd.split(' ');
	var season;
	var episodeMax = 0;
	var episodeMin = 100000000000;

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
		}
	};

	var title = dvd.substring(0,dvd.lastIndexOf(season) - 1);

	for (var j = episodeMin; j <= episodeMax; j++){
		var k = 0;
		k++;
		extract = {};
		extract.__fullname = title + ' ' + season + ' E' + j;
		extract.__foldername = season;
		extract.__show = title;
		extract.options = {};
		extract.options.title = k;
		control[dvd]['push'](extract);
	}
}
fs.writeFileSync(_controlFile2, JSON.stringify(control));