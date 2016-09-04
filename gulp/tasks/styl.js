"use strict";

var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-minify-css'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	stylus = require('gulp-stylus'),
	config = require('../config');

gulp.task('style:build', function () {
	gulp.src(config.src.style)
		.pipe(sourcemaps.init())
		.pipe(stylus({
			'include css': true
		}))
		.pipe(concat('build/css/app.css'))
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.'))
		.pipe(reload({stream: true}));
});