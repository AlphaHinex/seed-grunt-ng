'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    src: 'src',
    test: 'test',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    app: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: [
          '<%= app.src %>/**/*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/styles/**/*.css',
          '<%= app.src %>/**/*.html',
          '<%= app.src %>/**/*.css',
          '<%= app.src %>/images/**/*.{pgn,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              // redirect resources under '/bower_components' and '/src' in page with the static files from base path (this file's path)
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/src',
                connect.static('./src')
              ),
              connect().use(
                '/dist',
                connect.static('./dist')
              )
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= app.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= app.src %>/**/*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= app.dist %>/**/*'
          ]
        }]
      },
      server: '.tmp'
    },

    concat: {
      build: {
        files: [{
          '.tmp/app.js': ['<%= app.src %>/**/*.js'],
          '.tmp/app.css': ['<%= app.src %>/**/*.css'],
          '<%= app.dist %>/app.css': ['<%= app.src %>/**/*.css']
        }]
      },
      dist: {
        files: [{
          '.tmp/app.js': ['<%= app.src %>/**/*.js'],
          '.tmp/app.css': ['<%= app.src %>/**/*.css'],
          '<%= app.dist %>/app.css': ['<%= app.src %>/**/*.css']
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      build: {
        src: ['.tmp/app.js'],
        dest: '<%= app.dist %>/app.js'
      },
      dist: {
        src: ['.tmp/app.js'],
        dest: '.tmp/app.js'
      }
    },

    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['app.js'],
          dest: '<%= app.dist %>'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= app.dist %>/app.css': [
            '.tmp/app.css'
          ]
        }
      }
    }

  });

  grunt.registerTask('build', ['clean', 'concat:build', 'ngAnnotate:build']);

  grunt.registerTask('default', ['clean', 'concat:dist', 'ngAnnotate:dist', 'uglify', 'cssmin']);

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'build',
      'connect:livereload',
      'watch'
    ]);
  });

};