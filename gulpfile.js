const gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  scss = require('gulp-sass'),
  minifyCSS = require('gulp-minify-css'),
  streamify = require('gulp-streamify'),
  connect = require('gulp-connect'),
  inlineSource = require('gulp-inline-source'),
  plumber = require('gulp-plumber');

const paths = {
  dist : 'dist/',
  js : 'src/**/*.js',
  scss: 'src/**/*.scss',
  style : ['src/style/app.scss'],
  mainJs : 'src/app.js',
  assetsDir: 'assets/',
  assets: 'assets/**/*',
  html: 'index.html'
};

/* JS */

gulp.task('js', function() {
  browserify({
    entries: [paths.mainJs]
  })
    .bundle()
    .pipe(source('app.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(paths.dist));
});

/* STYLE */

gulp.task('style', function() {
  return gulp.src(paths.style)
    .pipe(plumber())
    .pipe(scss())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCSS({processImport: false}))
    .pipe(rename('app.css'))
    .pipe(gulp.dest(paths.dist));
});

/* WATCH */

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['style']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.html, ['template']);
});

/* TEMPLATE */

gulp.task('template', function() {
  return gulp.src(paths.html)
    .pipe(inlineSource())
    .pipe(gulp.dest(paths.dist));
});


/* CONNECT */

gulp.task('connect', function() {
  connect.server({
    port: 8888,
    root: 'dist'
  });
});

/* COPY */

gulp.task('copy', function() {
  gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist+'assets/'));
});

/* DEFAULT */

gulp.task('default', ['copy', 'template', 'watch', 'style', 'connect']);