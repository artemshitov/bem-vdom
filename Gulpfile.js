var gulp = require('gulp');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var del = require('del');

gulp.task('babel', function () {
    gulp.src('./src/bem-vdom.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    del.sync(['dist']);
});

gulp.task('build', ['babel']);

gulp.task('prepublish', ['clean', 'build']);

gulp.task('watch', ['build'], function () {
    gulp.watch('src/**/*.*', ['build']);
});
