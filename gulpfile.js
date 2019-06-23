var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require("gulp-rename");
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var del = require('del');
var browserSync = require('browser-sync').create();

function style() {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
}

function webserver() {
  browserSync.init({
    notify: false,
    server: "build/"
  });

  gulp.watch("source/less/**/*.less", style);
  gulp.watch("source/*.html", html);
}

function html() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
    // .pipe(browserSync.reload({stream: true}));
    .pipe(browserSync.stream());
}

function copy() {
  return gulp.src([
    "source/css/*",
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
}

function clean() {
  return del("build/*");
}

gulp.task('style', style);
gulp.task('server', gulp.series(html, webserver));
gulp.task('html', html);
gulp.task('copy', copy);
gulp.task('clean', clean);


gulp.task('build', gulp.series('clean', 'copy', 'style', 'html'));
gulp.task('default', gulp.series('build', 'server'));
