"use strict";

module.exports = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/'
  },
  src: {
    html: './src/*.html',
    js: ['./src/*.js', 'src/**/*.js'],
    style: ['./src/*.styl', 'src/**/*.styl'],
    img: './src/img/**/*.*'
  },
  watch: {
    html: ['./src/**/*.html'],
    js: ['./src/*.js', 'src/**/*.js'],
    style: ['./src/**/*.styl'],
    img: ['./src/img/**/*.*']
  },
  clean: './build',
  serverSettings: {
    server: {
      baseDir: "."
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
  }
};
