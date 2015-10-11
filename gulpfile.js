var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    babel = require('gulp-babel'),
    gulpif = require('gulp-if'),

    // special case for cli arguments
    argv = require('yargs').argv;

var paths = {
  js: 'resources/build/js/',
  css: 'resources/build/css/'
}

var jsfiles = {
  app: [
    'resources/js/app.js'
  ],
  vendor: [
    'resources/js/vendor/vue-1.0.0-beta.3.js',
    'resources/js/vendor/humanize-duration.js',
    'resources/js/vendor/zepto.js'
  ]
};

var stylefiles = {
  app: [
    'resources/scss/app.scss'
  ],
  vendor: [

  ]
};

/*
  Local app scripts are run through babel, for what it's worth
  and then divided up between uncompressed and compressed,
  and sent to their respective locations.
*/
gulp.task('js-app', function(){
  return gulp
          .src(jsfiles.app)
          .pipe(concat('app.js'))
          .pipe(babel())
          .pipe( gulpif(argv.production, uglify()) )
          .pipe(gulp.dest(paths.js))
          .pipe(
            gulpif(argv.production,
              notify({ message: 'production: js-app task complete' }),
              notify({ message: 'js-app task complete' })
            )
          );
});

/*
  Vendor scripts are not run through babel,
  and they are not perserved against minification.
*/
gulp.task('js-vendor', function(){
  return gulp
          .src(jsfiles.vendor)
          .pipe(concat('vendor.js'))
          .pipe( gulpif(argv.production, uglify()) )
          .pipe(gulp.dest(paths.js))
          .pipe(
            gulpif(argv.production,
              notify({ message: 'production: js-vendor task complete' }),
              notify({ message: 'js-vendor task complete' })
            )
          );
});

gulp.task('styles-app', function(){
  return sass(stylefiles.app, {style: 'expanded'})
          .pipe(autoprefixer('last 5 versions'))
          .pipe( gulpif(argv.production, minifycss()) )
          .pipe(gulp.dest(paths.css))
          .pipe(
            gulpif(argv.production,
              notify({ message: 'production: styles-app task complete' }),
              notify({ message: 'styles-app task complete' })
            )
          );
});

gulp.task('default', ['js-app', 'js-vendor', 'styles-app']);


gulp.task('watch', function(){
  gulp.start(['js-app', 'js-vendor', 'styles-app']);
  gulp.watch(jsfiles.app, ['js-app']);
  gulp.watch(jsfiles.vendor, ['js-vendor']);
  gulp.watch(stylefiles.app, ['styles-app']);
});
