const gulp = require('gulp');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

function es() {
  return gulp.src('galho.js')
    .pipe(sourcemaps.init())
    .pipe(terser({toplevel:true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
}

exports.default = es;