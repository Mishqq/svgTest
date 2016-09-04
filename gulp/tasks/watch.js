"use strict";

var gulp = require('gulp'),
		watch = require('gulp-watch'),
		config = require('../config');

gulp.task('watch', function(){
	watch([config.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([config.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([config.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([config.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
});