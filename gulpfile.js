var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    refresh = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();


// Server
gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if(err) return console.log(err);
  });
});


// Styles
gulp.task('styles', function() {
  gulp.src(['src/styles/app.less'])
      .pipe(less())
      .pipe(autoprefixer(
          'last 2 version',
          'safari 5',
          'ie 8', 'ie 9',
          'opera 12.1',
          'ios 6', 'android 4')
      )
      //.pipe(minifycss())
      .pipe(refresh(server))
      .pipe(gulp.dest('build'))
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
      .pipe(cache(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true }))
      )
      .pipe(refresh(server))
      .pipe(gulp.dest('build/img'))
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
      .pipe(gulp.dest('build/js'))
      .pipe(refresh(server))
});




// Run tasks
gulp.task('default', function() {

  gulp.run('lr-server', 'styles', 'images');

  gulp.watch('src/styles/**', function(ev) {
    console.log('File ' + ev.path + ' was ' + ev.type + ', running tasks...');
    gulp.run('styles');
  });

  gulp.watch('src/img/**/*', function(ev) {
    console.log('File ' + ev.path + ' was ' + ev.type + ', running tasks...');
    gulp.run('images');
  });

  gulp.watch('src/js/**/*.js', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('scripts');
  });
});