module.exports = function(grunt){
	function compileTemplates(){
		var doneCompile = function(js, err){
			if (err) { throw err; }
			fs.writeFileSync(__dirname + '/javascripts/templates.js', js);
		}
		temps.compile(doneCompile, __dirname + "/views/inc/", __dirname + "/views/");
	}
	grunt.registerTask('compileTemplates', '', compileTemplates);
}