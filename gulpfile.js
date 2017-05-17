'use strict'
var gulp = require('gulp'),webpack = require('webpack'),del = require('del');

var appWebpackConfigFactory = require('./webpack.config');

gulp.task('clean', function(cb) {
    del(['./dist/**/*']).then(function(paths){
        console.log('======= clear-dist =======:\n');
        cb();
    });
});

gulp.task('webpack',['clean'], function(cb) {
    var config = appWebpackConfigFactory.getConfig();
    webpack(config, cb);
});

gulp.task('default', ['webpack'], function() {
    console.log("======= done ======= ");
});