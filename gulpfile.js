var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('js', function(){
  var files = [
    'resources/js/app.js'
  ];
  return gulp.src(files)
        .pipe(concat('all.js'))
        .pipe(babel())
        .pipe(gulp.dest('resources/build/js/'));
});

gulp.task('default', ['js']);

gulp.task('watch', function(){
  gulp.watch('resources/js/*', ['js']);
});
