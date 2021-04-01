// Defining settings
var settings = {
	nodePath: './node_modules/',
	jsPath: './js-src/',
	scssSources: [
		'./sass/*.scss',
	]
};



// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');



// Run: 
// gulp clean-dist
// Delete existing generated files
gulp.task( 'clean-dist', function( done ) {
	del.sync( [ './dist' ] );
	done();
} );



// Run: 
// gulp build-css
// Builds css from scss for production environment.
gulp.task( 'build-css', gulp.series( function( done ) {
	return gulp.src( settings.scssSources )
		.pipe(plumber())
		// no sourcemaps
		.pipe(sass())
		.pipe(autoprefixer({ cascade: false }))
		.pipe(gulp.dest('./dist/')) // save .css
		.pipe(cssnano( { zindex:false, discardComments: {removeAll: true}, discardUnused: {fontFace: false}, reduceIdents: {keyframes: false} } ) )
		.pipe(rename( { suffix: '.min' } ) )
		// no sourcemaps
		.pipe(gulp.dest('./dist/')) // save .min.css
} ) );




// Run: 
// gulp build-js. 
// Uglifies and concat all JS files into one
gulp.task( 'build-js', gulp.series( function( done ) {
	gulp.src([
		settings.jsPath + '*.js',
	])
	.pipe(sourcemaps.init())
	.pipe(gulp.dest('./dist/')) // save .js
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('./dist/')); // save .min.js

	done();
} ) );



// Run: 
// gulp watch
// Starts watcher. Watcher runs appropriate tasks on file changes
gulp.task( 'watch', function ( done ) {
	gulp.watch( './sass/**/*.scss', gulp.series( 'build-css' ) );
	gulp.watch('./js-src/**/*.js', gulp.series( 'build-js' ) );
	gulp.watch('./package.json', gulp.series( 'build' ) );

	done();
} );



// Run: 
// gulp build
// Build css and js assets
gulp.task( 'build', gulp.series( gulp.series( 'clean-dist', gulp.parallel( 'build-js', 'build-css' ) ) ) );



// Run: 
// gulp
// Defines gulp default task
gulp.task( 'default', gulp.series( 'watch' ) );
