'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	config = require('../config');

gulp.task('webserver', function () {
	browserSync(config.serverSettings);
});

gulp.task('clean', function (cb) {
	rimraf(config.clean, cb);
});

gulp.task('build', [
	'html:build',
	'js:vendor',
	'js:build',
	'style:vendor',
	'style:build',
	'image:build'
]);

gulp.task('default', ['build', 'webserver', 'watch']);