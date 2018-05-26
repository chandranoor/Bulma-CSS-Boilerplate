"use strict";

var gulp = require('gulp'),
		del = require('del'),
	  sass = require('gulp-sass'),
		rename = require('gulp-rename'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
		maps = require('gulp-sourcemaps'),
	  htmlreplace = require('gulp-html-replace'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync').create(),
		cssmin = require('gulp-cssmin');
		
/* To enabled auto refresh when JS change, just uncomment this line ad change the source file below
gulp.task("concatScripts", function() {
	return gulp.src([
		'assets/js/functions.js'
	])
		.pipe(maps.init())
		.pipe(concat('main.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('assets/js'))
		.pipe(browserSync.stream());
});
gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("assets/js/main.js")
	  .pipe(uglify())
	  .pipe(rename('main.min.js'))
	  .pipe(gulp.dest('dist/assets/js'));
});
*/
gulp.task('compileSass', function() {
  return gulp.src("assets/sass/bulma.sass")
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src("assets/css/bulma.css")
    .pipe(cssmin())
    .pipe(rename('bulma.min.css'))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('assets/css/**/*.scss', ['compileSass']);
	/* To enabled auto refresh when JS change, just uncomment this line ad change the source file below
	gulp.watch('assets/js/*.js', ['concatScripts']);
	*/
})

gulp.task('clean', function() {
	del(['dist', 'assets/css/main.css*', 'assets/css/bulma.css*', 'assets/js/main*.js*']);
});

gulp.task('renameSources', function() {
  return gulp.src(['*.html', '*.php'])
    .pipe(htmlreplace({
			/* Enable JS rename resources please uncomment code below
			'js': 'assets/js/main.min.js',
			*/
      'css': 'assets/css/bulma.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task("build", [/*'minifyScripts', */ 'minifyCss'], function() {
  return gulp.src([
		'*.html',
		'*.php',
		'assets/favicon/**',
		'assets/img/**'
	], { base: './'})
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
  browserSync.init({
		server: "./",
		
  });

  gulp.watch("assets/css/**/*.scss", ['watchFiles']);
  gulp.watch(['*.html', '*.php']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function() {
  gulp.start('renameSources');
});