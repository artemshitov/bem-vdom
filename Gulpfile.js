var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var del = require('del');

gulp.task('babel', function () {
    gulp.src('./src/bem-vdom.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('browserify', ['babel'], function () {
    browserify({standalone: 'BEM'})
        .require('./dist/bem-vdom.js', {entry: true})
        .bundle()
        .pipe(source('bem-vdom.browser.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    del.sync(['dist']);
});

gulp.task('build', ['babel', 'browserify']);

gulp.task('prepublish', ['clean', 'build']);

gulp.task('watch', ['build'], function () {
    gulp.watch('src/**/*.*', ['build']);
});
