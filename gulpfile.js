var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('concat', function () {
    return gulp.src('./dist/*.js')
        .pipe(concat('payment-sdk.js'))
        .pipe(gulp.dest('./elements/'));
});

gulp.task('rename', function () {
    return gulp.src('./dist/styles.css')
        .pipe(gulp.dest('./elements'));
});

gulp.task('default', ['concat', 'rename']);
