var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    wrap = require('gulp-wrap'),
    minifyHTML = require('gulp-minify-html');

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src('js/*.js')
        .pipe(browserify())
        .pipe(concat('fixed.js'))
        .pipe(gulp.dest('./'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});

gulp.task('layouts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src('layouts/*.html')
        .pipe(minifyHTML())
        .pipe(wrap('layouts[\'<%= file.path.replace(file.base, \'\').replace(\'.html\', \'\') %>\'] = \'<%= contents %>\';\n'))
        .pipe(wrap('var layouts = {};\n<%= contents %>'))
        .pipe(concat('layouts.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
    return gulp.src('css/*.css')
        .pipe(concat('fixed.css'))
        .pipe(gulp.dest('./'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch('js/*', ['scripts']);
    gulp.watch('layouts/*', ['layouts']);
    gulp.watch('css/*', ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'layouts', 'styles', 'watch']);
