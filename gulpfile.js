'use strict'
let gulp = require('gulp');
let debug = require('gulp-debug');
let notifier = require('node-notifier');
let livereload = require('gulp-livereload');
let less = require('gulp-less');
let fileinclude = require('gulp-file-include');
let path = require('path');
let clean = require('gulp-clean');
let webserver = require('gulp-webserver');
let plumber = () => require('gulp-plumber')({
  errorHandler: errorAlert
})
gulp.task('clean', () => {
  return gulp.src([
    'dist/*.html', 
    'dist/css/*.css', 
    'dist/fonts/*.*',
    'dist/images/*.*'], {read: false}).pipe(clean());
});
gulp.task('fileinclude', () => {
  return gulp.src('src/index.html')
    .pipe(plumber())
    .pipe(debug())
    .pipe(fileinclude())
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('fonts', () => {
  gulp.src('src/fonts/*.*')   
    .pipe(plumber())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(livereload())
    .on('error', errorAlert);
})

gulp.task('images', () => {
  gulp.src('src/images/*.*')  
    .pipe(plumber())  
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload())
})

gulp.task('less', () => {
  return gulp.src('src/css/style.less')
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(less())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});
gulp.task('build', ['less', 'fileinclude', 'fonts', 'images'], () => {
  /* nop */
});
gulp.task('watch', ['build', 'webserver'], () => {
  livereload.listen();
  gulp.watch('src/images/*.*', ['images']);
  gulp.watch('src/fonts/*.*', ['fonts']);
  gulp.watch('src/css/*.less', ['less']);
  gulp.watch('src/*.html', ['fileinclude']);
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      open: false,
      directoryListing: false
    }));
});

gulp.task('default', ['watch']);

function errorAlert(err) {
  console.log(err.toString());
  notifier.notify({
  title: 'Error',
    message: err.message,
    sound: true
  });
}