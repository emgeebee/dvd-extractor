module.exports = function(grunt) {


console.log('grunt');
console.log(grunt);
console.log('grunt');
require(__dirname + "/Grunt/gruntTasks")(grunt);

  grunt.initConfig({
    watch: {
      backend: {
        files: [
          'src/**/*.js'
        ],
        tasks: ['develop'],
        options: { 
          livereload: true,
          nospawn: true
        }
      },
      sass: {
        files: ['src/SASS/*'],
        tasks: ['sass'],
        options: {
            livereload: true
        }
      },
      js: {
        files: ['src/javascripts/*'],
        tasks: ['concat:js'],
        options: {
            livereload: true
        }
      }
    },
    develop: {
      server: {
        file: 'src/server.js'
      }
    },
    concat: {
        options: {
            stripBanners: true,
            banner: "/*! <%= grunt.template.today('yyyy-mm-dd') %> */\n",
            separator: "\n"
        },
        js: {
            src: ["src/javascripts/jquery.js", "src/javascripts/**/*.js"],
            dest: "static/foot.js"
        }
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          "static/style.css":"src/SASS/main.scss"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  

  grunt.registerTask('default', ['develop', 'compileTemplates']);

};
