
// modules
const gulp = require('gulp'), // gulp
sass = require('gulp-sass'), // sass
autoprefixer = require('gulp-autoprefixer'), // sass - autoprefixer

jshint = require('gulp-jshint'), // js hint
stylish = require('jshint-stylish'), // js hint - reporter
concat = require('gulp-concat'), // js - concat
uglify = require('gulp-terser'), // js - uglify
babel = require('gulp-babel'), // babel transpiler
sourcemaps = require('gulp-sourcemaps'),

imagemin = require('gulp-imagemin'), // images - minify
pngquant = require('imagemin-pngquant'), // images(png) - minify


// rename = require("gulp-rename"), // rename minified files
notify = require('gulp-notify'), // gulp notifications
browserSync = require('browser-sync').create(), // server
plumber = require('gulp-plumber'); // error handling


// images
gulp.task('copy-images', function(){
	return gulp.src('./src/img/*')
		.pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
		.pipe(gulp.dest('./img'));
});

// sass
gulp.task('sass', function () {
	return gulp.src('./src/scss/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./css'))
		.pipe(notify('SCSS Compile - Successful'))
		.pipe(browserSync.stream());
});

// sass production
gulp.task('sass-dist', function () {
	return gulp.src('./src/scss/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./css'))
		.pipe(notify('SCSS Compile - Successful'))
		.pipe(browserSync.stream());
});


// js
gulp.task('scripts', function(){
	return gulp.src(['./src/js/dbhelper.js', './src/js/main.js', './src/js/restaurant_info.js'])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./js'))
		.pipe(browserSync.stream());
});

// js production
gulp.task('scripts-dist', function(){
	return gulp.src(['./src/js/dbhelper.js', './src/js/main.js', './src/js/restaurant_info.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./js'));
});

// development
gulp.task('default', ['copy-images', 'sass', 'scripts'], function() {
	browserSync.init({
		server: "./",
		port: 8000
	});
	gulp.watch("./src/scss/*.scss", ['sass', 'css-dist']);
	gulp.watch("./src/js/*.js", ['scripts']);
	gulp.watch("./index.html").on('change', browserSync.reload);
});

// production
gulp.task('dist', [
	'copy-images',
	'sass-dist',
	'scripts-dist'
]);
