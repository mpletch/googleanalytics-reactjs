var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback')


/*
  Styles Task
*/

gulp.task('sass', function () {

  // move over fonts
  gulp.src('styles/fonts/**.*')
    .pipe(gulp.dest('build/css/fonts'))

  // Compiles CSS
  gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/styles/'));
});

/*
  gulp.src('css/style.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/css/'))
    .pipe(reload({stream:true}))
});
*/

/*
  Images
*/
gulp.task('images',function(){
  gulp.src('css/images/**')
    .pipe(gulp.dest('./build/css/images'))
});

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./scripts/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [["babelify", { "presets": ["es2015", "react"] }]]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./build/scripts/'))
      // If you also want to uglify it
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('./build/scripts/'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['images','sass','scripts','browser-sync'], function() {
  gulp.watch('styles/**/*.scss', ['sass']); // gulp watch for stylus changes
  return buildScript('main.js', true); // browserify watch for JS changes
});
