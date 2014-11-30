module.exports = function (grunt) {

grunt.initConfig({
    copy: {
        dist: {
            files: [
                {src: 'bower_components/jquery/dist/jquery.min.js', dest: 'build/jquery.js'},
                {src: 'bower_components/dat-gui/build/dat.gui.min.js', dest: 'build/dat.gui.min.js'},
                {src: 'bower_components/bootstrap/dist/js/bootstrap.min.js', dest: 'build/bootstrap.js'},
                {src: 'sample.jpg', dest: 'build/sample.jpg'},
                {src: 'bower_components/bootstrap/dist/css/bootstrap.min.css', dest: 'build/bootstrap.css'}
            ]
        }
    },
    cssmin: {
        dist: {
            files: [                
                {src: 'style.css', dest: 'build/style.css'}
            ]
        }
    },
    uglify: {
        options: {
            mangle: {
                except : ['require', 'exports', 'module']
            }
        },
        dist: {
            files: [
                {src: 'bower_components/seajs/dist/sea.js', dest: 'build/sea.js'},
                {src: 'init.js', dest: 'build/init.js'},
                {src: 'util.js', dest: 'build/util.js'},
                {src: 'exp1.js', dest: 'build/exp1.js'},
                {src: 'exp2.js', dest: 'build/exp2.js'},
                {src: 'exp3.js', dest: 'build/exp3.js'},
                {src: 'exp4.js', dest: 'build/exp4.js'}
            ]
        }
    },
    processhtml: {
        dist: {
            files: [
                {src: 'index.html', dest: 'build/index.html'},
                {src: 'exp2.html', dest: 'build/exp2.html'},
                {src: 'exp3.html', dest: 'build/exp3.html'},
                {src: 'exp4.html', dest: 'build/exp4.html'}
            ]
        }
    },
    htmlmin: {
        dist: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true
            },
            files: [
                {
                    expand: true,
                    src: ['*.html'],
                    cwd: 'build/',
                    dest: 'build/'
                }
            ]
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-processhtml');

grunt.registerTask('default', ['copy', 'cssmin', 'uglify', 'processhtml', 'htmlmin']);

};