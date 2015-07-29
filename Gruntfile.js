var fs = require('fs');
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        run: {
            options: {
                // Task-specific options go here. 
            },
            patch: {
                cmd: 'npm',
                args: [
                    'version',
                    'patch'
                ]
            },
            minor: {
                cmd: 'npm',
                args: [
                    'version',
                    'minor'
                ]
            },
            major: {
                cmd: 'npm',
                args: [
                    'version',
                    'major'
                ]
            }
        }
    });
    
    grunt.registerTask('version', function (target) {
        if( target === 'patch' ){
            grunt.task.run('run:patch');
        } else if (target === 'minor') {
            grunt.task.run('run:minor');
        } else if (target === 'major') {
            grunt.task.run('run:major');
        } else {
//            return;   
        }
        var npmPkg = grunt.file.readJSON('package.json');
        var bowerPkg = grunt.file.readJSON('bower.json');
        bowerPkg.version = npmPkg.version;
        grunt.file.write('bower.json', JSON.stringify(bowerPkg, null, 2))
        console.log(npmPkg, bowerPkg);
    });
};