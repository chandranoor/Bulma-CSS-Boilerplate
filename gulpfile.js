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
  return gulp.src(["assets/sass/bulma/bulma.sass","assets/sass/custom/main.sass"])
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src(["assets/css/bulma.css","assets/css/main.css"])
    .pipe(cssmin())
    .pipe(rename({
			suffix: '.min'
		}))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchFiles', function() {
	gulp.watch(['assets/sass/**/**/*.sass', 'assets/sass/**/*.sass'], ['compileSass']);
	/* To enabled auto refresh when JS change, just uncomment this line ad change the source file below
	gulp.watch('assets/js/*.js', ['concatScripts']);
	*/
})

gulp.task('clean', function() {
	del(['dist', 'assets/css/main.css*', 'assets/css/bulma.css*']);
});

gulp.task('renameSources', function() {
  return gulp.src(['*.html', '*.php'])
    .pipe(htmlreplace({
			/* Enable JS rename resources please uncomment code below
			'js': 'assets/js/main.min.js',
			*/
			'bulmaCSS': 'assets/css/bulma.min.css',
			'mainCSS': 'assets/css/main.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task("release", [/*'minifyScripts', */ 'minifyCss'], function() {
  return gulp.src([
		'*.html',
		'*.php',
		'assets/favicon/**',
		'assets/img/**'
	], { base: './'})
		.pipe(gulp.dest('dist'));
});

gulp.task('go', ['watchFiles'], function(){
  browserSync.init({
		server: "./",
		
  });

	gulp.watch(["assets/sass/**/*.sass", "assets/sass/**/**/*.sass"], ['watchFiles']);
  gulp.watch(['*.html', '*.php']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'release'], function() {
  gulp.start('renameSources');
});