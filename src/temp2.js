var fs = require('fs');
var basefolder = "/Volumes/Videos/Films/";
var movefolder = "/Volumes/Recordings/Films/";


var genres = fs.readdirSync(basefolder);
for (var j = genres.length - 1; j >= 0; j--) {
	if(genres[j] == '.DS_Store'){
		continue;
	}
	var folder = basefolder + genres[j] + '/';
	var films = fs.readdirSync(folder);
	for (var c = films.length - 1; c >= 0; c--) {
	if(genres[j] == '.DS_Store'){
		continue;
	}
		var filmFolder = folder + films[c];
		if(fs.existsSync(filmFolder + '/' + films[c] + '.mpg')){
console.log(filmFolder + '/' + films[c] + '.mpg');
console.log(movefolder + genres[j]  + '/'+ films[c]);
	
			if(!fs.existsSync(movefolder + genres[j])){
				fs.mkdirSync(movefolder + genres[j]);
			}
			//fs.renameSync(filmFolder, movefolder + genres[j]  + '/'+ films[c]);
			require('child_process').spawn('mv', ['-r', filmFolder, movefolder + genres[j]  + '/'+ films[c]])
		}
	}
}